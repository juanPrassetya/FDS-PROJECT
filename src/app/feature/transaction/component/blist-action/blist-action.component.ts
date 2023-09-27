import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {UserGroupState} from "../../../user-group/state/user-group.state";
import {UserGroupDomain} from "../../../user-group/domain/user-group.domain";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {BlackListService} from "../../../black-list/service/black-list.service";
import {BlackListAdd} from "../../../black-list/state/black-list.actions";
import {BlackListDomain} from "../../../black-list/domain/black-list.domain";
import {TransParamGet} from "../../../transaction-parameter/state/trans-param.actions";
import {UserGroupGet} from "../../../user-group/state/user-group.actions";
import {TransactionService} from "../../service/transaction.service";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";

@Component({
  selector: 'app-blist-action',
  templateUrl: './blist-action.component.html',
  styleUrls: ['./blist-action.component.css']
})
export class BlistActionComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() selectedItem: Map<string, Object> = new Map<string, Object>()
  @Output() closeSelf = new EventEmitter<boolean>()
  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(UserGroupState.userGroups) userGroups$!: Observable<UserGroupDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();
  form!: FormGroup;
  entityTypes: Array<TransParamDomain> = [];
  userGroups: Array<UserGroupDomain> = [];
  userData!: UserDomain;
  isLoading: boolean = false

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private blackListService: BlackListService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      value: [{value: '', disabled: true}, Validators.required],
      entityType: ['', Validators.required],
      dateIn: ['', Validators.required],
      dateOut: ['', Validators.required],
      reason: [''],
      userGroup: [{value: '', disabled: true}, Validators.required]
    })

    this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.entityTypes = data
    })

    this.userGroups$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userGroups = data
    })

    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(BlackListAdd),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    this.action$
      .pipe(
        ofActionCompleted(BlackListAdd),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  getValueByEntityType() {
    const entity = this.form.get('entityType')?.value.attribute as string;
    let fetchData = this.selectedItem.get(entity);

    if (fetchData == undefined) {
      const filteredData = (this.selectedItem.get('addtData') as Array<any>).filter(addtData => addtData.attr == entity)
      if (filteredData.length > 0) {
        fetchData = filteredData[0].value
      }
    }

    this.getValueField()?.setValue(fetchData)
  }

  onDialogVisible() {
    this.isLoading = true

    this.transactionService.onFetchAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [
            ctx.dispatch(new TransParamGet()),
            ctx.dispatch(new UserGroupGet())
          ],
          this.destroyer$,
          () => {
            this.getUserGroupField()?.setValue(this.userData.userGroup)
            this.isLoading = false
          }
        )
      }
    )
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(data: BlackListDomain) {
    this.isLoading = true

    data.initiator = this.userData
    data.dateIn = DateUtils.ConvertToTimestampFormat(data.dateIn)
    data.dateOut = DateUtils.ConvertToTimestampFormat(data.dateOut)
    data.entityType = (this.getEntityTypeField()?.value as any).attribute

    this.blackListService.onAddBlackList(data)
  }

  isValueNotValid() {
    return this.getValueField()?.getRawValue() == '' || this.getEntityTypeField()?.hasError('required') ||
      this.getDateInField()?.hasError('required') || this.getDateOutField()?.hasError('required') ||
      this.getUserGroupField()?.hasError('required')
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

