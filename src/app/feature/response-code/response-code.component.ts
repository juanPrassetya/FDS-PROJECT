import { Component, OnInit } from '@angular/core';
import { ResponseCodeState } from './state/response-code.state';
import { ResponseCodeService } from './service/response-code.service';
import {
  AddResponseCode,
  DeleteResponseCode,
  GetResponseCode,
  GetResponseCodeQuery,
  UpdateResponseCode,
} from './state/response-code.action';
import { ResponseCodeDomain } from './domain/response-code.domain';
import {
  Select,
  Store,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
  ofActionErrored,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { UserDomain } from '../user/domain/user.domain';
import { ExtIntISO8583State } from '../ext-int-iso8583/state/ext-int-iso8583.state';
import { ExtIntISO8583Service } from '../ext-int-iso8583/service/ext-int-iso8583.service';
import {
  MessageConfigurationAdd,
  MessageConfigurationDelete,
  MessageConfigurationGet,
  MessageConfigurationUpdate,
} from '../ext-int-iso8583/state/ext-int-iso8583.actions';
import { MessageConfigurationDomain } from '../ext-int-iso8583/domain/message-configuration.domain';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-response-code',
  templateUrl: './response-code.component.html',
  styleUrls: ['./response-code.component.css'],
})
export class ResponseCodeComponent implements OnInit {
  @Select(ResponseCodeState.Responsecode) responseCodes$!: Observable<
    ResponseCodeDomain[]
  >;
  @Select(ExtIntISO8583State.messageConfigurations) messageConfig$!: Observable<
    MessageConfigurationDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();
  visibleResponseCodeDialog: boolean = false;
  visibleMessageConfigDialog: boolean = false;
  isLoading: boolean = true;
  formGroup!: FormGroup;

  dialogMode: string = 'add';

  messageConfigurationItems: Array<MessageConfigurationDomain> = [];
  responseCodeItems: Array<ResponseCodeDomain> = [];

  selectedMessageConfiguration!: MessageConfigurationDomain | undefined;
  selectedResponseCode!: ResponseCodeDomain | undefined;

  constructor(
    private store$: Store,
    private action$: Actions,
    private responseCodeService: ResponseCodeService,
    private confirmService: ConfirmService,
    private messageConfigService: ExtIntISO8583Service,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      configId: [''],
      name: [''],
      messageType: [''],
    });
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (
          this.store$.selectSnapshot(ExtIntISO8583State.messageConfigurations)
            .length > 0
        ) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.messageConfigService.onGetMessageConfiguration();
        }
      } else this.isLoading = false;
    });

    this.messageConfig$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfigurationItems = data;
    });

    this.responseCodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.responseCodeItems = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          MessageConfigurationAdd,
          MessageConfigurationDelete,
          MessageConfigurationUpdate
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedMessageConfiguration = undefined;
        this.messageConfigService.onGetMessageConfiguration();
      });

    this.action$
      .pipe(
        ofActionSuccessful(
          AddResponseCode,
          UpdateResponseCode,
          DeleteResponseCode
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedResponseCode = undefined;
        // this.responseCodeService.onGetAllResponseCode();
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
        ofActionCompleted(MessageConfigurationGet, GetResponseCode),
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
  }

  onMsgConfigChecked() {
    this.isLoading = true;
    this.selectedResponseCode = undefined;
    // if (this.selectedMessageConfiguration != undefined)
    //   this.responseCodeService.onGetAllResponseCode();
  
  }

  onMsgConfigUnChecked() {
    this.responseCodeItems = [];
    this.selectedResponseCode = undefined;
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    data.configId = data.configId.id

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.responseCodeService.onGetAllResponseCodeQuery(data);
          return
        }
      }
    }

    // this.responseCodeService.onGetAllResponseCode();
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

  onClickedMessageConfig() {
    this.dialogMode = 'add';
    this.visibleMessageConfigDialog = !this.visibleMessageConfigDialog;
  }

  onUpdateMessageConfig() {
    this.dialogMode = 'update';
    this.visibleMessageConfigDialog = !this.visibleMessageConfigDialog;
  }

  onCloseMessageConfig(stat: boolean) {
    this.visibleMessageConfigDialog = stat;
  }

  onDeleteResponseCode() {
    this.confirmService.showDialogConfirm(() => {
      this.responseCodeService.onDeleteResponseCode(
        Number(this.selectedResponseCode?.id)
      );
    });
  }

  onDeleteMessageConfig() {
    this.confirmService.showDialogConfirm(() => {
      this.messageConfigService.onDeleteMessageConfiguration(
        Number(this.selectedMessageConfiguration?.configId)
      );
    });
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }
}
