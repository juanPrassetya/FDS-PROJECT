import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {forkJoin, lastValueFrom, Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FraudListState} from "../../../fraud-list/state/fraud-list.state";
import {FraudListDomain} from "../../../fraud-list/domain/fraud-list.domain";
import {FraudListValueService} from "../../../fraud-list-value/service/fraud-list-value.service";
import {FraudListValueAdd} from "../../../fraud-list-value/state/fraud-list-value.actions";
import {FraudListValueDomain} from "../../../fraud-list-value/domain/fraud-list-value.domain";
import {TransactionService} from "../../service/transaction.service";
import {TransParamGet} from "../../../transaction-parameter/state/trans-param.actions";
import {FraudListGet} from "../../../fraud-list/state/fraud-list.actions";
import {UserGroupGet} from "../../../user-group/state/user-group.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";

@Component({
  selector: 'app-fraud-list-action',
  templateUrl: './fraud-list-action.component.html',
  styleUrls: ['./fraud-list-action.component.css']
})
export class FraudListActionComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() selectedItem: Map<string, Object> = new Map<string, Object>()
  @Output() closeSelf = new EventEmitter<boolean>()
  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(FraudListState.data) fraudList$!: Observable<FraudListDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();
  form!: FormGroup;
  entityTypes: Array<TransParamDomain> = [];
  fraudList: Array<FraudListDomain> = [];
  userData!: UserDomain;
  isLoading: boolean = false

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private fraudListValueService: FraudListValueService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      value: [{value: '', disabled: true}, Validators.required],
      entityType: ['', Validators.required],
      listId: ['', Validators.required]
    })

    this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.entityTypes = data
    })

    this.fraudList$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.fraudList = data
    })

    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(FraudListValueAdd),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    this.action$
      .pipe(
        ofActionCompleted(FraudListValueAdd),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading = true

    this.transactionService.onFetchAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new TransParamGet()), ctx.dispatch(new FraudListGet())],
          this.destroyer$,
          () => {
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

  onSave(data: FraudListValueDomain) {
    this.isLoading = true

    data.author = this.userData.username
    this.fraudListValueService.onAddFraudListValue(data)
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

  getValueField() {
    return this.form.get('value')
  }

  getEntityTypeField() {
    return this.form.get('entityType')
  }

  isValueNotValid() {
    return this.getValueField()?.getRawValue() == '' || this.getEntityTypeField()?.hasError('required')
  }

}
