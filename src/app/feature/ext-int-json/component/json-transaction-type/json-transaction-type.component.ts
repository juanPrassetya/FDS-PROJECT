import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Select, Store, Actions, ofActionSuccessful, ofActionCompleted, ofActionErrored} from '@ngxs/store';
import {Observable, Subject, takeUntil} from 'rxjs';
import {MessageConfigurationDomain} from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import {IntTransactionTypeDomain} from 'src/app/feature/transaction-type/domain/int-transaction-type.domain';
import {TransactionTypeDomain} from 'src/app/feature/transaction-type/domain/transaction-type.domain';
import {TransactionTypeService} from 'src/app/feature/transaction-type/service/transaction-type.service';
import {
  TransactionTypeAdd,
  TransactionTypeUpdate,
  TransactionTypeDelete,
  TransactionTypeGet,
  TransactionTypeGetQuery
} from 'src/app/feature/transaction-type/state/transaction-type.action';
import {TransactionTypeState} from 'src/app/feature/transaction-type/state/transaction-type.state';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {ConfirmService} from 'src/app/shared/services/confirm.service';
import {ExtIntJSONState} from '../../state/ext-int-json.state';

@Component({
  selector: 'app-json-transaction-type',
  templateUrl: './json-transaction-type.component.html',
  styleUrls: ['./json-transaction-type.component.css']
})
export class JsonTransactionTypeComponent implements OnInit, OnDestroy {
  @Select(TransactionTypeState.TransactionType) transTypes$!: Observable<
    TransactionTypeDomain[]
  >;
  @Select(ExtIntJSONState.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;
  @Select(ExtIntJSONState.intTransactionType)
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
  ) {
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

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onTransTypeChecked() {
  }

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
    console.log(data)
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

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }
}
