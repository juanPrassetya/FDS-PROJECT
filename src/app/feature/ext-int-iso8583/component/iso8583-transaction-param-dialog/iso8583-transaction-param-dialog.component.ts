import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Select,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
} from '@ngxs/store';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { TransParamDomain } from 'src/app/feature/transaction-parameter/domain/trans-param.domain';
import { TransParamService } from 'src/app/feature/transaction-parameter/service/trans-param.service';
import {
  TransParamAdd,
  TransParamUpdate,
} from 'src/app/feature/transaction-parameter/state/trans-param.actions';
import { TransParamState } from 'src/app/feature/transaction-parameter/state/trans-param.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { MessageConfigurationDomain } from '../../domain/message-configuration.domain';
import { ExtIntISO8583Service } from '../../service/ext-int-iso8583.service';
import { ExtIntISO8583State } from '../../state/ext-int-iso8583.state';
import { getIntRespCode } from '../../state/ext-int-iso8583.actions';

@Component({
  selector: 'app-iso8583-transaction-param-dialog',
  templateUrl: './iso8583-transaction-param-dialog.component.html',
  styleUrls: ['./iso8583-transaction-param-dialog.component.css'],
})
export class Iso8583TransactionParamDialogComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: TransParamDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntISO8583State.messageConfiguration)
  msgConfig$!: Observable<MessageConfigurationDomain>;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(TransParamState.transParams) transParams$!: Observable<
    TransParamDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;
  transParams: Array<TransParamDomain> = [];
  messageConfig: MessageConfigurationDomain | undefined;

  currentId: number = 0;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntISO8583Service: ExtIntISO8583Service,
    private transParamService: TransParamService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      attribute: ['', Validators.required],
      fieldTag: ['', Validators.required],
      configId: [''],
      description: ['', Validators.required],
      addtData: [true],
      // endpointId: [null]
    });

    this.transParams$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.transParams = data;
    });

    this.msgConfig$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfig = data;
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(TransParamAdd, TransParamUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionCompleted(TransParamAdd, TransParamUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false);
      });
  }

  ngOnDestroy() {
    this.form.reset();
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onDialogVisible() {
    if (this.dialogMode == 'EDIT') {
      this.setExistingDataToModel();
      this.isValueNotValid();
    }
  }

  setExistingDataToModel() {
    this.getAttribute()?.setValue(this.itemSelected?.attribute);
    this.getFieldTag()?.setValue(this.itemSelected?.fieldTag);
    this.getConfigId()?.setValue(this.itemSelected?.configId);
    this.getDescription()?.setValue(this.itemSelected?.description);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    data.configId = this.messageConfig;
    if (this.dialogMode == 'EDIT') {
      data.configId = this.messageConfig;
      data.attrId = this.itemSelected?.attrId;
      this.transParamService.onUpdateTransParam(data);
    } else this.transParamService.onAddTransParam(data);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  getEntityType() {
    this.transParamService.onFetchAllTransParam();
  }

  isValueNotValid() {
    const stat =
      this.getAttribute()?.getRawValue() == '' ||
      this.getFieldTag()?.hasError('required') ||
      this.getDescription()?.hasError('required');
    return stat != undefined ? stat : true;
  }

  getAttribute() {
    return this.form.get('attribute');
  }

  getFieldTag() {
    return this.form.get('fieldTag');
  }

  getConfigId() {
    return this.form.get('configId');
  }

  getDescription() {
    return this.form.get('description');
  }
}
