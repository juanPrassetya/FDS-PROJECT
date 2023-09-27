import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Select, Actions, ofActionSuccessful, ofActionCompleted} from '@ngxs/store';
import {Observable, Subject, takeUntil, forkJoin} from 'rxjs';
import {IntTransactionTypeDomain} from 'src/app/feature/transaction-type/domain/int-transaction-type.domain';
import {TransactionTypeDomain} from 'src/app/feature/transaction-type/domain/transaction-type.domain';
import {TransactionTypeService} from 'src/app/feature/transaction-type/service/transaction-type.service';
import {
  TransactionTypeAdd,
  TransactionTypeUpdate
} from 'src/app/feature/transaction-type/state/transaction-type.action';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {ExtIntJSONState} from '../../state/ext-int-json.state';
import {MessageConfigurationDomain} from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import {ExtIntJSONService} from '../../service/ext-int-json.service';
import {getIntTransactionType} from '../../state/ext-int-json.action';

@Component({
  selector: 'app-json-transaction-type-dialog',
  templateUrl: './json-transaction-type-dialog.component.html',
  styleUrls: ['./json-transaction-type-dialog.component.css']
})
export class JsonTransactionTypeDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: TransactionTypeDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntJSONState.messageConfiguration) msgConfig$!: Observable<
    MessageConfigurationDomain
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ExtIntJSONState.intTransactionType) intTransTypes$!: Observable<
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
    private extIntJSONService: ExtIntJSONService,
    private transTypeService: TransactionTypeService
  ) {
  }

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
    this.destroyer$.complete();
  }

  onDialogVisible() {
    this.isLoading.emit(true);
    this.extIntJSONService.onGetAllInformation((ctx) => {
      forkJoin([ctx.dispatch(new getIntTransactionType())]).subscribe(() => {
        if (this.dialogMode == 'update') {
          this.setExistingDataToModel();
          this.isValueNotValid();
        }

        setTimeout(() => {
          this.isLoading.emit(false);
        }, 300)
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
