import { Component } from '@angular/core';
import { TransactionTypeState } from './state/transaction-type.state';
import { TransactionTypeDomain } from './domain/transaction-type.domain';
import { TransactionTypeService } from './service/transaction-type.service';
import {
  TransactionTypeAdd,
  TransactionTypeDelete,
  TransactionTypeGet,
  TransactionTypeGetQuery,
  TransactionTypeUpdate,
} from './state/transaction-type.action';
import {
  Select,
  Store,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { UserDomain } from '../user/domain/user.domain';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.css'],
})
export class TransactionTypeComponent {
  @Select(TransactionTypeState.TransactionType) transTypes$!: Observable<
    TransactionTypeDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();

  visibleTransactionTypeDialog: boolean = false;
  isLoading: boolean = true;
  formGroup!: FormGroup

  dialogMode: string = 'ADD';

  transactionTypeItems: Array<TransactionTypeDomain> = [];
  selectedTransactionType: TransactionTypeDomain | undefined;

  constructor(
    private store$: Store,
    private action$: Actions,
    private transactionTypeService: TransactionTypeService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      configId: [''],
      transactionType: ['']
    })
    
    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(TransactionTypeState.TransactionType).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          // this.transactionTypeService.onGetAllTransactionType()
        }
      } else this.isLoading = false
    })

    this.transTypes$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.transactionTypeItems = data;
      })

    this.action$.pipe(
      ofActionSuccessful(TransactionTypeAdd, TransactionTypeUpdate, TransactionTypeDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedTransactionType = undefined
      // this.transactionTypeService.onGetAllTransactionType()
    })

    this.action$.pipe(
      ofActionCompleted(TransactionTypeGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(TransactionTypeGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })
  }

  onTransTypeChecked() {}

  onTransTypeUnChecked() {
    this.selectedTransactionType = undefined;
  }

  onClickedTransactionType() {
    this.dialogMode = 'ADD';
    this.visibleTransactionTypeDialog = !this.visibleTransactionTypeDialog;
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    data.configId = data.configId.id

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.transactionTypeService.onGetAllTransactionTypeQuery(data);
          return
        }
      }
    }

    // this.transactionTypeService.onGetAllTransactionType();
  }

  onUpdateTransactionType() {
    this.dialogMode = 'EDIT';
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
