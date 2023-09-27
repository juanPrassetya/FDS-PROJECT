import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  Select,
  Store,
  Actions,
  ofActionSuccessful,
  ofActionErrored,
  ofActionCompleted,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { ExtIntISO8583State } from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.state';
import { IntResponseCodeDomain } from 'src/app/feature/response-code/domain/int-response-code.domain';
import { ResponseCodeDomain } from 'src/app/feature/response-code/domain/response-code.domain';
import { ResponseCodeService } from 'src/app/feature/response-code/service/response-code.service';
import {
  AddResponseCode,
  DeleteResponseCode,
  UpdateResponseCode,
  GetResponseCode,
  GetResponseCodeQuery,
} from 'src/app/feature/response-code/state/response-code.action';
import { ResponseCodeState } from 'src/app/feature/response-code/state/response-code.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { ExtIntJSONState } from '../../state/ext-int-json.state';

@Component({
  selector: 'app-json-response-code',
  templateUrl: './json-response-code.component.html',
  styleUrls: ['./json-response-code.component.css'],
})
export class JsonResponseCodeComponent implements OnInit, OnDestroy {
  @Select(ResponseCodeState.Responsecode) responseCodes$!: Observable<ResponseCodeDomain[]>;
  @Select(ExtIntJSONState.messageConfiguration) messageConfigurations$!: Observable<MessageConfigurationDomain>;
  @Select(ExtIntJSONState.intResponseCode) intRespCodes$!: Observable<IntResponseCodeDomain[]>;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();
  visibleResponseCodeDialog: boolean = false;
  visibleMessageConfigDialog: boolean = false;
  isLoading: boolean = false;
  formGroup!: FormGroup;

  dialogMode: string = 'add';
  responseCodeItems: Array<ResponseCodeDomain> = [];
  intRespCodes: Array<IntResponseCodeDomain> = [];
  messageConfiguration: MessageConfigurationDomain | undefined
  selectedResponseCode!: ResponseCodeDomain | undefined;

  constructor(
    private store$: Store,
    private action$: Actions,
    private responseCodeService: ResponseCodeService,
    private confirmService: ConfirmService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      configId: [''],
      respCode: [''],
      intResp: [''],
    });

    this.responseCodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.responseCodeItems = data;
    });

    this.messageConfigurations$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
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
        this.responseCodeService.onGetAllResponseCode(Number(this.messageConfiguration?.configId));
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
      .pipe(
        ofActionCompleted(GetResponseCode),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(
        ofActionCompleted(GetResponseCodeQuery),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(GetResponseCodeQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.responseCodeService.onGetAllResponseCode(Number(this.messageConfiguration?.configId));
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    data.configId = this.messageConfiguration?.configId
    if(data.intResp) {
      data.intResp = data.intResp.id
    }

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != '') {
          this.responseCodeService.onGetAllResponseCodeQuery(data);
          return
        }
      }
    }

    this.responseCodeService.onGetAllResponseCode(Number(this.messageConfiguration?.configId));
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
