import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select, Actions, ofActionSuccessful, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { TransactionTypeDomain } from 'src/app/feature/transaction-type/domain/transaction-type.domain';
import { TransactionTypeService } from 'src/app/feature/transaction-type/service/transaction-type.service';
import { TransactionTypeAdd, TransactionTypeUpdate } from 'src/app/feature/transaction-type/state/transaction-type.action';
import { TransactionTypeState } from 'src/app/feature/transaction-type/state/transaction-type.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { MessageConfigurationDomain } from '../../domain/message-configuration.domain';
import { ExtIntISO8583Service } from '../../service/ext-int-iso8583.service';
import { ExtIntISO8583State } from '../../state/ext-int-iso8583.state';
import { getIntTransactionType } from '../../state/ext-int-iso8583.actions';
import { IntTransactionTypeDomain } from 'src/app/feature/transaction-type/domain/int-transaction-type.domain';

@Component({
  selector: 'app-iso8583-transaction-type-dialog',
  templateUrl: './iso8583-transaction-type-dialog.component.html',
  styleUrls: ['./iso8583-transaction-type-dialog.component.css']
})
export class Iso8583TransactionTypeDialogComponent {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: TransactionTypeDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntISO8583State.messageConfiguration) msgConfig$!: Observable<
    MessageConfigurationDomain
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ExtIntISO8583State.intTransactionType) intTransTypes$!: Observable<
    IntTransactionTypeDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;
  intTransTypes: Array<IntTransactionTypeDomain> = [];
  messageConfig: MessageConfigurationDomain | undefined

  currentId: number = 0;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntISO8583Service: ExtIntISO8583Service,
    private transTypeService: TransactionTypeService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      transType: ['', Validators.required],
      configId: [''],
      intTransType: ['', Validators.required]
    });

    this.intTransTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.intTransTypes = data;
    });

    this.msgConfig$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfig = data;
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(TransactionTypeAdd, TransactionTypeUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionCompleted(TransactionTypeAdd, TransactionTypeUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false);
      });
  }

  ngOnDestroy() {
    this.form.reset();
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true);
    this.extIntISO8583Service.onGetAllInformation((ctx) => {
      forkJoin([ctx.dispatch(new getIntTransactionType())]).subscribe(() => {
        if (this.dialogMode == 'update') {
          this.setExistingDataToModel();
          this.isValueNotValid();
        }
        this.isLoading.emit(false);
      });
    });
  }

  setExistingDataToModel() {
    this.getTransTypeField()?.setValue(this.itemSelected?.transType);
    this.getIntTransType()?.setValue(this.itemSelected?.intTransType);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    data.configId = this.messageConfig
    if (this.dialogMode == 'update') {
      data.id = this.itemSelected?.id
      this.transTypeService.onUpdateTransactionType(data);
    } else this.transTypeService.onAddTransactionType(data);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  isValueNotValid() {
    const stat =
      this.getTransTypeField()?.getRawValue() == '' ||
      this.getIntTransType()?.hasError('required')
    return stat != undefined ? stat : true;
  }

  getTransTypeField() {
    return this.form.get('transType');
  }

  getIntTransType() {
    return this.form.get('intTransType');
  }
}
