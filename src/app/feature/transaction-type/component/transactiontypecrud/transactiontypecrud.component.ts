import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransactionTypeState } from '../../state/transaction-type.state';
import { TransactionTypeService } from '../../service/transaction-type.service';
import { TransactionTypeAdd, TransactionTypeUpdate } from '../../state/transaction-type.action';
import { TransactionTypeDomain } from '../../domain/transaction-type.domain';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select, Actions, ofActionSuccessful, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserGroupService } from 'src/app/feature/user-group/service/user-group.service';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { ExtIntISO8583State } from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.state';
import { ExtIntISO8583Service } from 'src/app/feature/ext-int-iso8583/service/ext-int-iso8583.service';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { StringUtils } from 'src/app/shared/utils/string.utils';

@Component({
  selector: 'app-transactiontypecrud',
  templateUrl: './transactiontypecrud.component.html',
  styleUrls: ['./transactiontypecrud.component.css']
})
export class TransactiontypecrudComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: TransactionTypeDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntISO8583State.messageConfigurations) msgConfig$!: Observable<
    MessageConfigurationDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(TransactionTypeState.TransactionType) transTypes$!: Observable<
    TransactionTypeDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;
  transTypes: Array<TransactionTypeDomain> = [];
  messageConfig: Array<MessageConfigurationDomain> = [];

  currentId: number = 0;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private messageConfigService: ExtIntISO8583Service,
    private transTypeService: TransactionTypeService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      transType: ['', Validators.required],
      configId: ['', Validators.required],
    });

    this.transTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.transTypes = data;
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
    this.destroyer$.complete();
  }

  onDialogVisible() {
    
    this.getMessageConfiguration();
    this.setExistingDataToModel()
    this.isLoading.emit(false);
  }

  setExistingDataToModel() {
    this.getTransTypeField()?.setValue(this.itemSelected?.transType);
    this.getConfigIdField()?.setValue(this.itemSelected?.configId);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    if (this.dialogMode == 'EDIT') {
      data.id = this.itemSelected?.id
      this.transTypeService.onUpdateTransactionType(data);
    } else this.transTypeService.onAddTransactionType(data);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  getMessageConfiguration() {
    this.messageConfigService.onGetMessageConfiguration();
  }

  isValueNotValid() {
    const stat =
      this.getTransTypeField()?.getRawValue() == '' ||
      this.getConfigIdField()?.hasError('required')
    return stat != undefined ? stat : true;
  }

  getTransTypeField() {
    return this.form.get('transType');
  }

  getConfigIdField() {
    return this.form.get('configId');
  }

}
