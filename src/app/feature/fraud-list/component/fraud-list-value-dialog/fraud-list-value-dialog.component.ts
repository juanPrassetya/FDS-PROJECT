import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FraudListValueDomain} from "../../../fraud-list-value/domain/fraud-list-value.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {FraudListState} from "../../state/fraud-list.state";
import {FraudListDomain} from "../../domain/fraud-list.domain";
import {FraudListValueService} from "../../../fraud-list-value/service/fraud-list-value.service";
import {FraudListValueAdd, FraudListValueUpdate} from "../../../fraud-list-value/state/fraud-list-value.actions";

@Component({
  selector: 'app-fraud-list-value-dialog',
  templateUrl: './fraud-list-value-dialog.component.html',
  styleUrls: ['./fraud-list-value-dialog.component.css']
})
export class FraudListValueDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected!: FraudListValueDomain | undefined
  @Input() listSelected!: FraudListDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(FraudListState.data) fraudLists$!: Observable<FraudListDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  form!: FormGroup;
  userData!: UserDomain;
  fraudLists: Array<FraudListDomain> = [];

  currentValue: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private fraudListValueService: FraudListValueService,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      listId: [{value: '', disabled: true}, Validators.required]
    })

    this.fraudLists$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.fraudLists = data
    })

    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(FraudListValueAdd, FraudListValueUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(FraudListValueAdd, FraudListValueUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.currentValue = this.itemSelected != undefined ? this.itemSelected.value : ''

      this.getValueField()?.setValue(this.itemSelected?.value)
      this.getListIdField()?.setValue(this.itemSelected?.listId)
    } else {
      this.getListIdField()?.setValue(this.listSelected)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)
    data.author = this.userData.username

    if (this.dialogMode == 'EDIT') {
      this.fraudListValueService.onUpdateFraudListValue(this.currentValue, data)
    } else this.fraudListValueService.onAddFraudListValue(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getValueField()?.hasError('required') || this.getListIdField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getValueField() {
    return this.form.get('value')
  }

  getListIdField() {
    return this.form.get('listId')
  }
}
