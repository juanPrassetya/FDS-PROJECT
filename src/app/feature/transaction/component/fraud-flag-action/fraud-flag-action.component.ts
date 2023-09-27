import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TransactionDomain} from "../../domain/transaction.domain";
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {TransactionService} from "../../service/transaction.service";
import {TransactionAssignFraudFlag} from "../../state/transaction.actions";

@Component({
  selector: 'app-fraud-flag-action',
  templateUrl: './fraud-flag-action.component.html',
  styleUrls: ['./fraud-flag-action.component.css']
})
export class FraudFlagActionComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() selectedItem: TransactionDomain | undefined

  @Output() closeSelf = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  form!: FormGroup;
  isLoading: boolean = false

  assignedFraudFlags: any

  dummyFraudFlag = [
    {
      code: 0,
      name: 'NOT FRAUD'
    },
    {
      code: 1,
      name: 'SUSPICIOUS'
    },
    {
      code: 2,
      name: 'FRAUD'
    },
  ]

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      fraudFlag: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(TransactionAssignFraudFlag),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      if (this.selectedItem != undefined)
        this.selectedItem.fraudFlags = this.assignedFraudFlags
      this.onClose()
    })

    this.action$
      .pipe(
        ofActionCompleted(TransactionAssignFraudFlag),
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
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(data: any) {
    if (this.selectedItem != undefined) {
      this.isLoading = true
      this.assignedFraudFlags = data.fraudFlag.code
      this.selectedItem.fraudFlags = data.fraudFlag.code
      this.transactionService.onAssignFraudFlag(this.selectedItem)
    }
  }

  isValueNotValid() {
    const stat = this.getFlagField()?.hasError('required')
    if (stat != undefined)
      return stat
    return true;
  }

  getFlagField() {
    return this.form.get('fraudFlag')
  }
}
