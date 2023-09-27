import {Component, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {FraudReactionsDomain} from '../../domain/fraud-reactions.domain';
import {Actions, ofActionErrored, ofActionSuccessful, Select,} from '@ngxs/store';
import {Observable, Subject, takeUntil} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FraudReactionsService} from '../../service/fraud-reactions.service';
import {FraudReactionsAdd, FraudReactionsUpdate,} from '../../state/fraud-reactions.actions';
import {StringUtils} from '../../../../shared/utils/string.utils';
import {WhiteListDomain} from '../../../white-list/domain/white-list.domain';
import {WhiteListState} from '../../../white-list/state/white-list.state';
import {NotifTemplateDomain} from '../../../notification-template/domain/notif-template.domain';
import {RecipientSetupDomain} from '../../../recipient-setup/domain/recipient-setup.domain';
import {RecipientGroupDomain} from '../../../recipient-group/domain/recipient-group.domain';
import {NotifTemplateState} from '../../../notification-template/state/notif-template.state';
import {RecipientSetupState} from '../../../recipient-setup/state/recipient-setup.state';
import {RecipientGroupState} from '../../../recipient-group/state/recipient-group.state';
import {NotifTemplateGet} from '../../../notification-template/state/notif-template.actions';
import {RecipientSetupGet} from '../../../recipient-setup/state/recipient-setup.actions';
import {RecipientGroupGet} from '../../../recipient-group/state/recipient-group.actions';
import {WhiteListGet} from '../../../white-list/state/white-list.actions';
import {ForkJoinHelper} from '../../../../shared/utils/rxjs.utils';
import {IntResponseCodeDomain} from 'src/app/feature/response-code/domain/int-response-code.domain';
import {ExtIntISO8583State} from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.state';
import {getIntRespCode} from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.actions';
import {TransParamState} from '../../../transaction-parameter/state/trans-param.state';
import {TransParamDomain} from '../../../transaction-parameter/domain/trans-param.domain';
import {FraudListState} from '../../../fraud-list/state/fraud-list.state';
import {FraudListDomain} from '../../../fraud-list/domain/fraud-list.domain';
import {TransParamGet} from '../../../transaction-parameter/state/trans-param.actions';
import {FraudListGet} from '../../../fraud-list/state/fraud-list.actions';
import {UserGroupDomain} from 'src/app/feature/user-group/domain/user-group.domain';
import {UserGroupState} from 'src/app/feature/user-group/state/user-group.state';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {DateUtils} from 'src/app/shared/utils/date.utils';
import {UserGroupGet} from 'src/app/feature/user-group/state/user-group.actions';

@Component({
  selector: 'app-white-reactions-dialog',
  templateUrl: './white-reactions-dialog.component.html',
  styleUrls: ['./white-reactions-dialog.component.css'],
})
export class WhiteReactionsDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: FraudReactionsDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(WhiteListState.data) whiteLists$!: Observable<WhiteListDomain[]>;
  @Select(ExtIntISO8583State.intResponseCode) intRespCodes$!: Observable<
    IntResponseCodeDomain[]
  >;
  @Select(TransParamState.transParams) transParams$!: Observable<
    TransParamDomain[]
  >;
  @Select(FraudListState.data) fraudList$!: Observable<FraudListDomain[]>;
  @Select(NotifTemplateState.data) notifTemplates$!: Observable<
    NotifTemplateDomain[]
  >;
  @Select(RecipientSetupState.data) recipients$!: Observable<
    RecipientSetupDomain[]
  >;
  @Select(RecipientGroupState.data) recipientGroups$!: Observable<
    RecipientGroupDomain[]
  >;
  @Select(UserGroupState.userGroups) userGroups$!: Observable<
    UserGroupDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  whiteLists: Array<WhiteListDomain> = [];
  intRespCodes: Array<IntResponseCodeDomain> = [];
  transParams: Array<TransParamDomain> = [];
  fraudList: Array<FraudListDomain> = [];
  notifTemplate: Array<NotifTemplateDomain> = [];
  recipients: Array<RecipientSetupDomain> = [];
  recipientGroups: Array<RecipientGroupDomain> = [];
  userGroups: Array<UserGroupDomain> = [];
  userData!: UserDomain;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private fraudReactionService: FraudReactionsService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      bindingType: [{value: '', disabled: true}, Validators.required],
      bindingId: ['', Validators.required],
      priority: ['', Validators.required],
      zone: ['', Validators.required],
      action: [''],
      actionValue: ['', Validators.required],
      listId: ['', Validators.required],
      value: ['', Validators.required],
      templateId: ['', Validators.required],
      recipientType: ['', Validators.required],
      listRecipient: ['', Validators.required],
      listRecipientGroup: ['', Validators.required],
      description: ['', Validators.required],
      dateIn: ['', Validators.required],
      dateOut: ['', Validators.required],
      userGroup: [{value: '', disabled: true}, Validators.required],
    });

    this.whiteLists$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.whiteLists = data;
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getBindingIdField()?.setValue(
          this.whiteLists.find((v1) => v1.id == this.itemSelected?.bindingId)
        );
      }
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.userGroups$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userGroups = data;
    });

    // this.respCodes$
    //   .pipe(
    //     takeUntil(this.destroyer$)
    //   ).subscribe(data => {
    //   this.respCodes = data
    //   if (this.dialogMode == 'EDIT' && this.respCodes.length > 0) {
    //     this.getActionValueField()?.setValue(this.respCodes.find(v1 => v1.respCode == this.itemSelected?.actionValue))
    //   }
    // })

    this.intRespCodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.intRespCodes = data;
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getActionValueField()?.setValue(
          this.intRespCodes.find(
            (v1) => v1.code == this.itemSelected?.actionValue
          )
        );
      }
    });

    this.transParams$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.transParams = data;
      if (
        this.dialogMode == 'EDIT' &&
        this.itemSelected?.action == 'ATTR_FRAUD_LIST' &&
        data.length > 0
      ) {
        const data = JSON.parse(this.itemSelected.actionValue);
        this.getValueField()?.setValue(
          this.transParams.find((v1) => v1.attribute == data.attribute)
        );
      }
      if (
        this.dialogMode == 'EDIT' &&
        (this.itemSelected?.action == 'ATTR_WHITE_LIST' || this.itemSelected?.action == 'ATTR_BLACK_LIST') &&
        data.length > 0
      ) {
        const data = JSON.parse(this.itemSelected.actionValue);
        this.getActionValueField()?.setValue(
          this.transParams.find((v1) => v1.attribute == data.attribute)
        );
      }

      if (
        this.dialogMode == 'EDIT' &&
        this.itemSelected?.action == 'ATTR_FRAUD_LIST' &&
        data.length > 0
      ) {
        const data = JSON.parse(this.itemSelected.actionValue);
        this.getValueField()?.setValue(
          this.transParams.find((v1) => v1.attribute == data.attribute)
        );
      }
    });

    this.fraudList$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.fraudList = data;
      if (
        this.dialogMode == 'EDIT' &&
        this.itemSelected?.action == 'ATTR_FRAUD_LIST' &&
        data.length > 0
      ) {
        const data = JSON.parse(this.itemSelected.actionValue);
        this.getListIdField()?.setValue(
          this.fraudList.find((v1) => v1.listId == data.listId)
        );
      }
    });

    this.notifTemplates$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.notifTemplate = data;
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        if (this.itemSelected?.action == 'EMAIL_NOTIFICATION') {
          const data = JSON.parse(this.itemSelected.actionValue);
          this.getTemplateField()?.setValue(
            this.notifTemplate.find(
              (v1) => v1.templateId.toString() == data.templateId.toString()
            )
          );
        }
      }
    });

    this.recipients$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.recipients = data;
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        if (this.itemSelected?.action == 'EMAIL_NOTIFICATION') {
          const data = JSON.parse(this.itemSelected.actionValue);
          this.getListRecipientField()?.setValue(
            this.recipients.find(
              (v1) => v1.recipientId.toString() == data.recipient.toString()
            )
          );
        }
      }
    });

    this.recipientGroups$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.recipientGroups = data;
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        if (this.itemSelected?.action == 'EMAIL_NOTIFICATION') {
          const data = JSON.parse(this.itemSelected.actionValue);
          this.getListRecipientGroupField()?.setValue(
            this.recipientGroups.find(
              (v1) => v1.groupId.toString() == data.recipientGroup.toString()
            )
          );
        }
      }
    });

    this.action$
      .pipe(
        ofActionSuccessful(FraudReactionsAdd, FraudReactionsUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionErrored(FraudReactionsAdd, FraudReactionsUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false);
      });

    // this.action$
    //   .pipe(
    //     ofActionCompleted(FraudReactionsAdd, FraudReactionsUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.form.reset();
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onDialogVisible() {
    this.isLoading.emit(true);

    this.fraudReactionService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(new WhiteListGet()),
          // ctx.dispatch(new RespCodeMappingGet()),
          ctx.dispatch(new NotifTemplateGet()),
          ctx.dispatch(new RecipientSetupGet()),
          ctx.dispatch(new RecipientGroupGet()),
          ctx.dispatch(new getIntRespCode()),
          ctx.dispatch(new TransParamGet()),
          ctx.dispatch(new FraudListGet()),
          ctx.dispatch(new UserGroupGet()),
        ],
        this.destroyer$,
        () => {
          if (this.dialogMode == 'EDIT') {
            if (this.itemSelected != undefined) {
              this.getBindingTypeField()?.setValue(
                this.itemSelected.bindingType
              );
              this.getPriorityField()?.setValue(
                StringUtils.dummyPriority.find(
                  (v1) => v1.code == this.itemSelected?.priority
                )
              );
              // this.getZoneField()?.setValue(StringUtils.dummyZone.find(v1 => v1.name == this.itemSelected?.zone))
              this.getActionField()?.setValue(
                StringUtils.dummyAction.find(
                  (v1) => v1.name == this.itemSelected?.action
                )
              );
              this.getDescriptionField()?.setValue(
                this.itemSelected.description
              );

              if (this.itemSelected?.action == 'EMAIL_NOTIFICATION') {
                const existType = JSON.parse(
                  this.itemSelected.actionValue
                ).recipientType;
                this.getRecipientTypeField()?.setValue(
                  StringUtils.dummyRecipientType.find(
                    (v1) => v1.code == existType
                  )
                );
              }
            }
            if (this.itemSelected?.action == 'ATTR_WHITE_LIST') {
              const existType = JSON.parse(
                this.itemSelected.actionValue
              );

              this.getDateInField()?.setValue(
                DateUtils.ConvertToDateFormat(existType.dateIn)
              );
              this.getDateOutField()?.setValue(
                DateUtils.ConvertToDateFormat(existType.dateOut)
              );
            }
          } else {
            this.getBindingTypeField()?.setValue('WHITELIST');
            this.getUserGroupField()?.setValue(this.userData?.userGroup)
          }

          this.isLoading.emit(false);
        }
      );
    });
  }

  onSave(data: any) {
    this.isLoading.emit(true);

    if (data.dateIn != undefined || data.dateIn != '')
      data.dateIn = DateUtils.ConvertToDateFormat(data.dateIn);

    if (data.dateOut != undefined || data.dateOut != '')
      data.dateOut = DateUtils.ConvertToDateFormat(data.dateOut);

    if (this.dialogMode == 'EDIT') {
      if (this.itemSelected != undefined) {
        this.itemSelected.action = data.action.name;
        this.itemSelected.bindingId = data.bindingId.id;
        this.itemSelected.priority = data.priority.code;
        // this.itemSelected.zone = data.zone.name

        switch (this.itemSelected.action) {
          case 'SET_RESPCODE':
            this.itemSelected.actionValue = data.actionValue?.code;
            break;

          case 'ATTR_BLACK_LIST':
          case 'ATTR_WHITE_LIST':
            this.itemSelected.actionValue = JSON.stringify({
              attribute: data.actionValue?.attribute,
              dateIn: data.actionValue?.dateIn,
              dateOut: data.actionValue?.dateOut,
              uGroupId: this.userData.userGroup?.id,
              initiatorId: this.userData.id
            }).replace(':', ': ')
            break;

          case 'ATTR_FRAUD_LIST':
            this.itemSelected.actionValue = JSON.stringify({
              attribute: data.value.attribute,
              listId: data.listId.listId,
            }).replaceAll(':', ': ');
            break;

          case 'EMAIL_NOTIFICATION':
            this.itemSelected.actionValue = JSON.stringify({
              recipientType: data.recipientType.code,
              recipient:
                data.recipientType.code == 'RECIPIENT'
                  ? data.listRecipient.recipientId
                  : 0,
              recipientGroup:
                data.recipientType.code == 'RECIPIENT_GROUP'
                  ? data.listRecipientGroup.groupId
                  : 0,
              templateId: data.templateId.templateId,
            }).replaceAll(':', ': ');
            break;
        }

        this.fraudReactionService.onUpdateFraudReactions(this.itemSelected);
      }
    } else {
      const fixData = data;
      fixData.action = data.action.name;
      fixData.bindingId = data.bindingId.id;
      fixData.priority = data.priority.code;
      fixData.zone = data.zone.name;

      switch (fixData.action) {
        case 'SET_RESPCODE':
          fixData.actionValue = data.actionValue?.code;
          break;

        case 'ATTR_BLACK_LIST':
        case 'ATTR_WHITE_LIST':
          fixData.actionValue = JSON.stringify({
            attribute: data.actionValue?.attribute,
            dateIn: data.dateIn,
            dateOut: data.dateOut,
            uGroupId: this.userData.userGroup?.id,
            initiatorId: this.userData.id
          }).replace(':', ': ')
          break;

        case 'ATTR_FRAUD_LIST':
          fixData.actionValue = JSON.stringify({
            attribute: data.value.attribute,
            listId: data.listId.listId,
          }).replaceAll(':', ': ');
          break;

        case 'EMAIL_NOTIFICATION':
          fixData.actionValue = JSON.stringify({
            recipientType: fixData.recipientType.code,
            recipient:
              data.recipientType.code == 'RECIPIENT'
                ? fixData.listRecipient.recipientId
                : 0,
            recipientGroup:
              data.recipientType.code == 'RECIPIENT_GROUP'
                ? fixData.listRecipientGroup.groupId
                : 0,
            templateId: fixData.templateId.templateId,
          }).replaceAll(':', ': ');
          break;
      }

      this.fraudReactionService.onAddFraudReactions(data);
    }
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  onChangeAction(value: any) {
    this.getActionValueField()?.setValue('');
  }

  isActionField(code: string) {
    const value = (this.form.getRawValue() as any)?.action?.name;
    return value == code;
  }

  isRecipientType(code: string) {
    const value = (this.form.getRawValue() as any)?.recipientType?.code;
    return value == code;
  }

  isValueNotValid() {
    let stat;

    if (
      (this.form.getRawValue() as any).action.name == 'EMAIL_NOTIFICATION' &&
      (this.form.getRawValue() as any).recipientType.code == 'RECIPIENT'
    ) {
      stat =
        this.getBindingTypeField()?.getRawValue() == '' ||
        this.getBindingIdField()?.hasError('required') ||
        this.getPriorityField()?.hasError('required') ||
        this.getActionField()?.hasError('required') ||
        this.getListRecipientField()?.hasError('required');
      this.getTemplateField()?.hasError('required') ||
      this.getRecipientTypeField()?.hasError('required');
    }

    if (
      (this.form.getRawValue() as any).action.name == 'EMAIL_NOTIFICATION' &&
      (this.form.getRawValue() as any).recipientType.code == 'RECIPIENT_GROUP'
    ) {
      stat =
        this.getBindingTypeField()?.getRawValue() == '' ||
        this.getBindingIdField()?.hasError('required') ||
        this.getPriorityField()?.hasError('required') ||
        this.getActionField()?.hasError('required') ||
        this.getTemplateField()?.hasError('required') ||
        this.getRecipientTypeField()?.hasError('required') ||
        this.getListRecipientGroupField()?.hasError('required');
    }

    if ((this.form.getRawValue() as any).action.name == 'ATTR_FRAUD_LIST') {
      stat =
        this.getBindingTypeField()?.getRawValue() == '' ||
        this.getBindingIdField()?.hasError('required') ||
        this.getPriorityField()?.hasError('required') ||
        this.getActionField()?.hasError('required') ||
        this.getValueField()?.hasError('required') ||
        this.getListIdField()?.hasError('required');
    }

    if (
      (this.form.getRawValue() as any).action.name == 'SET_RESPCODE' ||
      (this.form.getRawValue() as any).action.name == 'ATTR_BLACK_LIST' ||
      (this.form.getRawValue() as any).action.name == 'ATTR_WHITE_LIST'
    ) {
      stat =
        this.getBindingTypeField()?.getRawValue() == '' ||
        this.getBindingIdField()?.hasError('required') ||
        this.getPriorityField()?.hasError('required') ||
        this.getActionField()?.hasError('required') ||
        this.getActionValueField()?.hasError('required');
    }

    if ((this.form.getRawValue() as any).action.name == 'CREATE_ALERT') {
      stat =
        this.getBindingTypeField()?.getRawValue() == '' ||
        this.getBindingIdField()?.hasError('required') ||
        this.getPriorityField()?.hasError('required') ||
        this.getActionField()?.hasError('required');
    }

    return stat != undefined ? stat : true;
  }

  getBindingTypeField() {
    return this.form.get('bindingType');
  }

  getBindingIdField() {
    return this.form.get('bindingId');
  }

  getPriorityField() {
    return this.form.get('priority');
  }

  // getZoneField() {
  //   return this.form.get('zone')
  // }

  getActionField() {
    return this.form.get('action');
  }

  getActionValueField() {
    return this.form.get('actionValue');
  }

  getValueField() {
    return this.form.get('value');
  }

  getListIdField() {
    return this.form.get('listId');
  }

  getDescriptionField() {
    return this.form.get('description');
  }

  getTemplateField() {
    return this.form.get('templateId');
  }

  getRecipientTypeField() {
    return this.form.get('recipientType');
  }

  getListRecipientField() {
    return this.form.get('listRecipient');
  }

  getListRecipientGroupField() {
    return this.form.get('listRecipientGroup');
  }

  getDateInField() {
    return this.form.get('dateIn');
  }

  getDateOutField() {
    return this.form.get('dateOut');
  }

  getUserGroupField() {
    return this.form.get('userGroup');
  }
}
