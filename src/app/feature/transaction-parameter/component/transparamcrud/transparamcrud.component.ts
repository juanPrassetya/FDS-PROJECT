import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransParamDomain } from '../../domain/trans-param.domain';
import { ResponseCodeState } from 'src/app/feature/response-code/state/response-code.state';
import { ResponseCodeService } from 'src/app/feature/response-code/service/response-code.service';
import {
  TransParamAdd,
  TransParamUpdate,
} from '../../state/trans-param.actions';
import { TransParamService } from '../../service/trans-param.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Select,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { TransParamState } from '../../state/trans-param.state';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { ExtIntISO8583State } from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.state';
import { ExtIntISO8583Service } from 'src/app/feature/ext-int-iso8583/service/ext-int-iso8583.service';

@Component({
  selector: 'app-transparamcrud',
  templateUrl: './transparamcrud.component.html',
  styleUrls: ['./transparamcrud.component.css'],
})
export class TransparamcrudComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: TransParamDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntISO8583State.messageConfigurations) msgConfig$!: Observable<
    MessageConfigurationDomain[]
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
  messageConfig: Array<MessageConfigurationDomain> = [];

  currentId: number = 0;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private messageConfigService: ExtIntISO8583Service,
    private transParamService: TransParamService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      attribute: ['', Validators.required],
      fieldTag: ['', Validators.required],
      configId: ['', Validators.required],
      description: [''],
      addtData: [true],
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
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.getEntityType();
    this.getMessageConfiguration();
    if (this.dialogMode == 'EDIT') {
      this.setExistingDataToModel();
      this.isValueNotValid();
    }
    this.isLoading.emit(false);
  }

  setExistingDataToModel() {
    this.getAttribute()?.setValue(this.itemSelected?.attribute);
    this.getFieldTag()?.setValue(this.itemSelected?.fieldTag);
    this.getConfigId()?.setValue(this.itemSelected?.configId);
    this.getDescription()?.setValue(this.itemSelected?.description);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
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

  getMessageConfiguration() {
    this.messageConfigService.onGetMessageConfiguration();
  }

  isValueNotValid() {
    return (
      this.getAttribute()?.getRawValue() == '' ||
      this.getFieldTag()?.hasError('required') ||
      this.getConfigId()?.hasError('required')
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
