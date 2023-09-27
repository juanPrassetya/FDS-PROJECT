import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Select, Actions, ofActionSuccessful, ofActionCompleted} from '@ngxs/store';
import {Observable, Subject, takeUntil} from 'rxjs';
import {MessageConfigurationDomain} from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import {ExtIntISO8583Service} from 'src/app/feature/ext-int-iso8583/service/ext-int-iso8583.service';
import {ExtIntISO8583State} from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.state';
import {TransParamDomain} from 'src/app/feature/transaction-parameter/domain/trans-param.domain';
import {TransParamService} from 'src/app/feature/transaction-parameter/service/trans-param.service';
import {TransParamAdd, TransParamUpdate} from 'src/app/feature/transaction-parameter/state/trans-param.actions';
import {TransParamState} from 'src/app/feature/transaction-parameter/state/trans-param.state';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {JsonEndpointDomain} from '../../domain/json-endpoint.domain';
import {ExtIntJSONState} from '../../state/ext-int-json.state';

@Component({
  selector: 'app-json-transaction-param-dialog',
  templateUrl: './json-transaction-param-dialog.component.html',
  styleUrls: ['./json-transaction-param-dialog.component.css']
})
export class JsonTransactionParamDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: TransParamDomain | undefined;
  @Input() endpointSelected!: JsonEndpointDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntJSONState.messageConfiguration) msgConfig$!: Observable<
    MessageConfigurationDomain
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(TransParamState.transParams) transParams$!: Observable<
    TransParamDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;
  transParams: Array<TransParamDomain> = [];
  messageConfig: MessageConfigurationDomain | undefined

  currentId: number = 0;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntISO8583Service: ExtIntISO8583Service,
    private transParamService: TransParamService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      attribute: [{value: '', disabled: false}, Validators.required],
      fieldTag: ['', Validators.required],
      configId: [''],
      description: ['', Validators.required],
      addtData: [true],
      endpoint: [null]
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
    this.destroyer$.next(true)
    this.destroyer$.complete();
  }

  onDialogVisible() {
    if (this.dialogMode == 'EDIT') {
      this.setExistingDataToModel();
      this.isValueNotValid();
      if (!this.itemSelected?.addtData) {
        this.getAttribute()?.disable()
      }
    }

    this.isLoading.emit(false)
  }

  setExistingDataToModel() {
    this.getAttribute()?.setValue(this.itemSelected?.attribute);
    this.getFieldTag()?.setValue(this.itemSelected?.fieldTag);
    this.getConfigId()?.setValue(this.itemSelected?.configId);
    this.getDescription()?.setValue(this.itemSelected?.description);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    data.configId = this.messageConfig
    data.endpoint = this.endpointSelected
    if (this.dialogMode == 'EDIT') {
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
    return (
      this.getAttribute()?.getRawValue() == '' ||
      this.getFieldTag()?.hasError('required') ||
      this.getConfigId()?.hasError('required') ||
      this.getDescription()?.hasError('required')
    );
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
