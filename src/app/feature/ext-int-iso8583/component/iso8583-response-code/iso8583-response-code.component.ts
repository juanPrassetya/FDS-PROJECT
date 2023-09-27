import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ResponseCodeDomain } from 'src/app/feature/response-code/domain/response-code.domain';
import { ResponseCodeService } from 'src/app/feature/response-code/service/response-code.service';
import {
  AddResponseCode,
  DeleteResponseCode,
  GetResponseCode,
  GetResponseCodeQuery,
  UpdateResponseCode,
} from 'src/app/feature/response-code/state/response-code.action';
import { ResponseCodeState } from 'src/app/feature/response-code/state/response-code.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { MessageConfigurationDomain } from '../../domain/message-configuration.domain';
import { ExtIntISO8583State } from '../../state/ext-int-iso8583.state';
import { IntResponseCodeDomain } from 'src/app/feature/response-code/domain/int-response-code.domain';

@Component({
  selector: 'app-iso8583-response-code',
  templateUrl: './iso8583-response-code.component.html',
  styleUrls: ['./iso8583-response-code.component.css'],
})
export class Iso8583ResponseCodeComponent implements OnInit, OnDestroy {
  @Select(ResponseCodeState.Responsecode) responseCodes$!: Observable<
    ResponseCodeDomain[]
  >;
  @Select(ExtIntISO8583State.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;
  @Select(ExtIntISO8583State.intResponseCode) intRespCodes$!: Observable<
    IntResponseCodeDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();
  visibleResponseCodeDialog: boolean = false;
  visibleMessageConfigDialog: boolean = false;
  isLoading: boolean = false;
  formGroup!: FormGroup;

  dialogMode: string = 'add';
  responseCodeItems: Array<ResponseCodeDomain> = [];
  intRespCodes: Array<IntResponseCodeDomain> = [];
  messageConfiguration: MessageConfigurationDomain | undefined;
  selectedResponseCode!: ResponseCodeDomain | undefined;

  constructor(
    private store$: Store,
    private action$: Actions,
    private responseCodeService: ResponseCodeService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      configId: [''],
      respCode: [''],
      intResp: [''],
    });

    this.responseCodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.responseCodeItems = data;
    });

    this.messageConfigurations$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.messageConfiguration = data;
      });

    this.intRespCodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.intRespCodes = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          AddResponseCode,
          DeleteResponseCode,
          UpdateResponseCode
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedResponseCode = undefined;
        this.responseCodeService.onGetAllResponseCode(
          Number(this.messageConfiguration?.configId)
        );
      });

    this.action$
      .pipe(
        ofActionErrored(
          AddResponseCode,
          DeleteResponseCode,
          UpdateResponseCode
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(GetResponseCode), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(GetResponseCodeQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(GetResponseCodeQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onMsgResponseCodeChecked() {
    this.isLoading = true;
    this.selectedResponseCode = undefined;
    if (this.selectedResponseCode != undefined)
      this.responseCodeService.onGetAllResponseCode(
        Number(this.messageConfiguration?.configId)
      );
  }

  onMsgConfigUnChecked() {
    this.responseCodeItems = [];
    this.selectedResponseCode = undefined;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.responseCodeService.onGetAllResponseCode(
      Number(this.messageConfiguration?.configId)
    );
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    data.configId = this.messageConfiguration?.configId;
    if(data.intResp) {
      data.intResp = data.intResp.id;
    }

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (controlValue != null && controlValue != '') {
          this.responseCodeService.onGetAllResponseCodeQuery(data);
          return;
        }
      }
    }

    this.responseCodeService.onGetAllResponseCode(
      Number(this.messageConfiguration?.configId)
    );
  }

  onClickedResponseCode() {
    this.dialogMode = 'add';
    this.visibleResponseCodeDialog = !this.visibleResponseCodeDialog;
  }

  onUpdateResponseCode() {
    this.dialogMode = 'update';
    this.visibleResponseCodeDialog = !this.visibleResponseCodeDialog;
  }

  onCloseResponseCode(stat: boolean) {
    this.visibleResponseCodeDialog = stat;
  }

  onDeleteResponseCode() {
    this.confirmService.showDialogConfirm(() => {
      this.responseCodeService.onDeleteResponseCode(
        Number(this.selectedResponseCode?.id)
      );
    });
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }
}
