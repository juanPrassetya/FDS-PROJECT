import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AlertInvestigationDomain} from "../../domain/alert-investigation.domain";
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {AlertInvestigationService} from "../../service/alert-investigation.service";
import {
  AlertInvestigationActionForwardedTo,
  AlertInvestigationTakeAction
} from "../../state/alert-investigation.actions";
import {UserState} from "../../../user/state/user.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {UserService} from "../../../user/service/user.service";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {FraudListDomain} from "../../../fraud-list/domain/fraud-list.domain";
import {FraudListState} from "../../../fraud-list/state/fraud-list.state";
import {FraudListService} from "../../../fraud-list/service/fraud-list.service";
import {UserGroupDomain} from "../../../user-group/domain/user-group.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {AlertInvestigationDataDomain} from "../../domain/alert-investigation-data.domain";
import {UserGet, UserGetForward} from "../../../user/state/user.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {FraudListGet, FraudListGetByEntity} from "../../../fraud-list/state/fraud-list.actions";

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css']
})
export class ActionDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() itemSelected!: AlertInvestigationDataDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(UserState.data) userList$!: Observable<UserDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(FraudListState.dataByEntity) fraudLists$!: Observable<FraudListDomain[]>

  private destroyer$ = new Subject();

  form!: FormGroup;
  userList: Array<UserDomain> = []
  userData!: UserDomain
  fraudLists: Array<FraudListDomain> = [];
  userGroups: Array<UserGroupDomain> = [];

  dummyActionType = [
    {name: 'Add Alert Comment', code: '91'},
    {name: 'Forward To', code: '92'},
    {name: 'Add Card to List', code: '93'},
    {name: 'Add Account to List', code: '94'},
    {name: 'Add Merchant to List', code: '95'},
    {name: 'Add Terminal to List', code: '96'},
    {name: 'Remove Card from List', code: '70'},
    {name: 'Remove Account from List', code: '71'},
    {name: 'Remove Merchant from List', code: '72'},
    {name: 'Remove Terminal from List', code: '73'},
    {name: 'Put Card in Whitelist', code: '82'},
    {name: 'Put Account in Whitelist', code: '83'},
    {name: 'Put Merchant in Whitelist', code: '84'},
    {name: 'Put Terminal in Whitelist', code: '85'},
    {name: 'Put Card in Blacklist', code: '86'},
    {name: 'Put Account in Blacklist', code: '87'},
    {name: 'Put Merchant in Blacklist', code: '88'},
    {name: 'Put Terminal in Blacklist', code: '89'}
  ]

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private alertInvestigationService: AlertInvestigationService,
    private userService: UserService,
    private fraudListService: FraudListService,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      actionType: ['', Validators.required],
      comment: ['', Validators.required],
      username: ['', Validators.required],
      listId: ['', Validators.required],
      entityType: [{value: '', disabled: true}, Validators.required],
      dateIn: ['', Validators.required],
      dateOut: ['', Validators.required],
      reason: [''],
      userGroup: [{value: '', disabled: true}, Validators.required],
      value: [{value: '', disabled: true}, Validators.required]
    })

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data
      if (data != undefined) {
        if (data.userGroup != undefined) {
          this.userGroups.push(...this.userGroups, data.userGroup)
          this.getUserGroupField()?.setValue(data.userGroup)
        }
      }
    })

    this.userList$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
        if (data.length > 0){
          this.userList = data.filter(v1 => v1.username != this.userData.username)
        }
    })

    this.fraudLists$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.fraudLists = data
    })

    this.action$
      .pipe(
        ofActionSuccessful
        (
          AlertInvestigationTakeAction, AlertInvestigationActionForwardedTo
        ),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    this.action$
      .pipe(
        ofActionCompleted(
          FraudListGetByEntity, UserGet,
          AlertInvestigationTakeAction, AlertInvestigationActionForwardedTo
        ),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading.emit(false)
    })
  }

  ngOnDestroy() {
    this.form.reset()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)
    this.alertInvestigationService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new UserGetForward(this.userData.username))],
          this.destroyer$,
          () => {
            this.isLoading.emit(false)
          }
        )
      }
    )
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(value: any) {
    if (this.itemSelected != undefined) {
      this.isLoading.emit(true)
      const alertData = new AlertInvestigationDomain()
      alertData.caseId = this.itemSelected.case_id
      alertData.initiator = this.userData.username
      alertData.actionType = this.itemSelected.action_type
      alertData.caseComment = value.comment
      alertData.actionType = value.actionType.code

      if (value.actionType.code == '91' || value.actionType.code == '92') {
        switch (value.actionType.code) {
          case '91':
            this.alertInvestigationService.onTakeActionAlertInvestigation(alertData)
            break

          case '92':
            alertData.forwardedTo = value.username.id
            this.alertInvestigationService.onForwardedToActionAlertInvestigation(alertData)
            break
        }

      } else {
        switch (value.actionType.code) {
          //Fraud List Value
          case '93':
          case '70':
          case '94':
          case '71':
          case '95':
          case '72':
          case '96':
          case '73':
            alertData.listId = value.listId.listId
            alertData.value = value.value

            this.alertInvestigationService.onTakeActionAlertInvestigation(alertData)
            break

          //White List
          case '82':
          case '83':
          case '84':
          case '85':

          //Black List
          case '86':
          case '87':
          case '88':
          case '89':
            if (this.userData.userGroup != undefined) {
              alertData.reason = value.reason
              alertData.entityType = value.entityType
              alertData.datein = DateUtils.ConvertToTimestampFormatV2(value.dateIn)
              alertData.dateout = DateUtils.ConvertToTimestampFormatV2(value.dateOut)
              alertData.userGroupId = String(this.userData.userGroup.id)
              alertData.value = value.value

              this.alertInvestigationService.onTakeActionAlertInvestigation(alertData)
            }
            break
        }
      }
    }
  }

  actionChecker(value: any) {
    this.getListField()?.setValue('')
    this.getUsernameField()?.setValue('')

    switch (value.value.code) {
      case '92':
        this.isLoading.emit(true)
        this.getUserList()
        break

      case '93':
      case '70':
        this.isLoading.emit(true)
        this.getFraudList(1)
        this.getValueField()?.setValue(this.itemSelected?.hpan)
        break

      case '94':
      case '71':
        this.isLoading.emit(true)
        this.getFraudList(5)
        this.getValueField()?.setValue(this.itemSelected?.acct1)
        break

      case '95':
      case '72':
        this.isLoading.emit(true)
        this.getFraudList(2)
        this.getValueField()?.setValue(this.itemSelected?.merchant_type)
        break

      case '96':
      case '73':
        this.isLoading.emit(true)
        this.getFraudList(3)
        this.getValueField()?.setValue(this.itemSelected?.terminal_id)
        break

      case '82':
      case '86':
        this.getEntityTypeField()?.setValue('hpan')
        this.getValueField()?.setValue(this.itemSelected?.hpan)
        break

      case '83':
      case '87':
        this.getEntityTypeField()?.setValue('acct1')
        this.getValueField()?.setValue(this.itemSelected?.acct1)
        break

      case '84':
      case '88':
        this.getEntityTypeField()?.setValue('merchantType')
        this.getValueField()?.setValue(this.itemSelected?.merchant_type)
        break

      case '85':
      case '89':
        this.getEntityTypeField()?.setValue('terminalId')
        this.getValueField()?.setValue(this.itemSelected?.terminal_id)
        break

      default:
        this.getValueField()?.reset()
        break
    }
  }

  getFraudList(entity: number) {
    this.fraudListService.onGetFraudListByEntity(entity)
  }

  getUserList() {
    this.userService.onGetUser()
  }

  isValueNotValid() {
    const value = (this.form.getRawValue() as any)?.actionType

    if (value != undefined) {
      if (value.code == '91') {
        const stat = this.getActionField()?.hasError('required') || this.getCommentField()?.hasError('required')
        if (stat != undefined) {
          return stat
        } else return true
      }

      if (value.code == '92') {
        const stat = this.getActionField()?.hasError('required') || this.getUsernameField()?.hasError('required')
        if (stat != undefined) {
          return stat
        } else return true
      }

      if (this.isActionList()) {
        const stat = this.getActionField()?.hasError('required') || this.getListField()?.hasError('required') || this.getValueField()?.getRawValue() == ''
        if (stat != undefined) {
          return stat
        } else return true
      }

      if (this.isWhiteBlackList()) {
        const stat = this.getValueField()?.getRawValue() == '' || this.getEntityTypeField()?.hasError('required') ||
          this.getDateInField()?.hasError('required') || this.getDateOutField()?.hasError('required') ||
          this.getUserGroupField()?.hasError('required')
        if (stat != undefined) {
          return stat
        } else return true
      }
    }

    const stat = this.getActionField()?.hasError('required')
    if (stat != undefined)
      return stat
    return true;
  }

  isActionField(code: string) {
    const value = (this.form.getRawValue() as any)?.actionType?.code
    return value == code
  }

  isActionList() {
    return this.isActionField('93') || this.isActionField('94') ||
      this.isActionField('95') || this.isActionField('96') ||
      this.isActionField('70') || this.isActionField('71') ||
      this.isActionField('72') || this.isActionField('73')
  }

  isWhiteBlackList() {
    return this.isActionField('82') || this.isActionField('83') ||
      this.isActionField('84') || this.isActionField('85') ||
      this.isActionField('86') || this.isActionField('87') ||
      this.isActionField('88') || this.isActionField('89')
  }

  getActionField() {
    return this.form.get('actionType')
  }

  getCommentField() {
    return this.form.get('comment')
  }

  getUsernameField() {
    return this.form.get('username')
  }

  getListField() {
    return this.form.get('listId')
  }

  getValueField() {
    return this.form.get('value')
  }

  getEntityTypeField() {
    return this.form.get('entityType')
  }

  getDateInField() {
    return this.form.get('dateIn')
  }

  getDateOutField() {
    return this.form.get('dateOut')
  }

  getUserGroupField() {
    return this.form.get('userGroup')
  }
}
