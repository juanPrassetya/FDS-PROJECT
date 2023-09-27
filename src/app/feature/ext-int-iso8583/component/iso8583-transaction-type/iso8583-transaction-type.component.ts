import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  Select,
  Store,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
  ofActionErrored,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TransactionTypeDomain } from 'src/app/feature/transaction-type/domain/transaction-type.domain';
import { TransactionTypeService } from 'src/app/feature/transaction-type/service/transaction-type.service';
import {
  TransactionTypeAdd,
  TransactionTypeUpdate,
  TransactionTypeDelete,
  TransactionTypeGet,
  TransactionTypeGetQuery,
} from 'src/app/feature/transaction-type/state/transaction-type.action';
import { TransactionTypeState } from 'src/app/feature/transaction-type/state/transaction-type.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { MessageConfigurationDomain } from '../../domain/message-configuration.domain';
import { ExtIntISO8583State } from '../../state/ext-int-iso8583.state';
import { IntTransactionTypeDomain } from 'src/app/feature/transaction-type/domain/int-transaction-type.domain';

@Component({
  selector: 'app-iso8583-transaction-type',
  templateUrl: './iso8583-transaction-type.component.html',
  styleUrls: ['./iso8583-transaction-type.component.css'],
})
export class Iso8583TransactionTypeComponent implements OnInit, OnDestroy {
  @Select(TransactionTypeState.TransactionType) transTypes$!: Observable<
    TransactionTypeDomain[]
  >;
  @Select(ExtIntISO8583State.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;
  @Select(ExtIntISO8583State.intTransactionType)
  intTransTypes$!: Observable<IntTransactionTypeDomain[]>;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();

  visibleTransactionTypeDialog: boolean = false;
  isLoading: boolean = false;
  formGroup!: FormGroup;

  dialogMode: string = 'ADD';

  transactionTypeItems: Array<TransactionTypeDomain> = [];
  intTransTypes: Array<IntTransactionTypeDomain> = [];
  messageConfiguration: MessageConfigurationDomain | undefined
  selectedTransactionType: TransactionTypeDomain | undefined;

  constructor(
    private store$: Store,
    private action$: Actions,
    private transactionTypeService: TransactionTypeService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      configId: [''],
      transType: [''],
      intTransType: ['']
    });

    this.transTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.transactionTypeItems = data;
    });

    this.intTransTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.intTransTypes = data;
    });

    this.messageConfigurations$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfiguration = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          TransactionTypeAdd,
          TransactionTypeUpdate,
          TransactionTypeDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedTransactionType = undefined;
        this.transactionTypeService.onGetAllTransactionType(Number(this.messageConfiguration?.configId))
      });

    this.action$
      .pipe(ofActionCompleted(TransactionTypeGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(TransactionTypeGetQuery),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(TransactionTypeGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onTransTypeChecked() {}

  onTransTypeUnChecked() {
    this.selectedTransactionType = undefined;
  }

  onClickedTransactionType() {
    this.dialogMode = 'ADD';
    this.visibleTransactionTypeDialog = !this.visibleTransactionTypeDialog;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.transactionTypeService.onGetAllTransactionType(Number(this.messageConfiguration?.configId));
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    data.configId = this.messageConfiguration?.configId
    if(data.intTransType) {
      data.intTransType = data.intTransType.id
    }

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (
          controlValue != null &&
          controlValue != undefined &&
          controlValue != ''
        ) {
          this.transactionTypeService.onGetAllTransactionTypeQuery(data);
          return;
        }
      }
    }

    this.transactionTypeService.onGetAllTransactionType(Number(this.messageConfiguration?.configId));
  }

  onUpdateTransactionType() {
    this.dialogMode = 'update';
    this.visibleTransactionTypeDialog = !this.visibleTransactionTypeDialog;
  }
  onCloseTransactionType(stat: boolean) {
    this.visibleTransactionTypeDialog = stat;
  }

  onDeleteTransactionType() {
    this.confirmService.showDialogConfirm(() => {
      this.transactionTypeService.onDeleteTransactionType(
        Number(this.selectedTransactionType?.id)
      );
    });
  }
}
