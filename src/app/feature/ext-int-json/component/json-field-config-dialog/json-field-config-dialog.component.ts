import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {JsonEndpointDomain} from '../../domain/json-endpoint.domain';
import {JsonConfigsHeaderDomain} from '../../domain/json-header-field.domain';
import {JsonFormatterDomain} from '../../domain/json-formatter.domain';
import {JsonFieldTypeDomain} from '../../domain/json-field-type.domain';
import {
  Actions,
  Select,
  ofActionCompleted,
  ofActionSuccessful,
} from '@ngxs/store';
import {Observable, Subject, forkJoin, takeUntil} from 'rxjs';
import {ExtIntJSONState} from '../../state/ext-int-json.state';
import {ExtIntJSONService} from '../../service/ext-int-json.service';
import {
  JSONDataType,
  JSONFormatterGet,
  JSONHeaderConfigsAddField,
  JSONHeaderConfigsUpdateField,
} from '../../state/ext-int-json.action';
import {MessageConfigurationDomain} from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import {JsonActionDomain} from '../../domain/json-action.domain';
import {ConfirmService} from 'src/app/shared/services/confirm.service';

@Component({
  selector: 'app-json-field-config-dialog',
  templateUrl: './json-field-config-dialog.component.html',
  styleUrls: ['./json-field-config-dialog.component.css'],
})
export class JsonFieldConfigDialogComponent implements OnInit, OnDestroy {
  @Select(ExtIntJSONState.formatters)
  formatters$!: Observable<JsonFormatterDomain[]>;
  @Select(ExtIntJSONState.dataTypes)
  dataTypes$!: Observable<JsonFieldTypeDomain[]>;
  @Select(ExtIntJSONState.messageConfiguration)
  messageConfig$!: Observable<MessageConfigurationDomain>;
  @Input() isOpen: boolean = true;
  @Input() endpointId!: number;
  @Input() dialogMode: string = 'add';
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Input() selectedItem: any | undefined;
  @Input() states: any | undefined;


  sequence: number = 1;
  private destroyer$ = new Subject();

  protected readonly StringUtils = StringUtils;

  formatters: Array<JsonFormatterDomain> = [];
  dataTypes: Array<JsonFieldTypeDomain> = [];
  messageConfig: MessageConfigurationDomain | undefined;
  visibleActionDialog: boolean = false;
  componentMode: string = 'header'
  dialogActionMode: string = 'add'
  actions: JsonActionDomain[] = [];

  selectedAction: any | undefined;

  form!: FormGroup;

  state = [
    {name: 'Request', code: 1},
    {name: 'Response', code: 2},
  ]

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntJSONService: ExtIntJSONService,
    private confirmService: ConfirmService
  ) {
  }

  ngOnDestroy(): void {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      parentField: [null],
      fieldName: ['', Validators.required],
      length: ['', Validators.required],
      sequence: ['', Validators.required],
      dataType: ['', Validators.required],
      formatter: [''],
      msgConfig: ['', Validators.required],
      endpoint: ['', Validators.required],
      actions: [],
      validValues: [],
      state: []
    });

    this.formatters$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.formatters = data;
    });

    this.dataTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.dataTypes = data;
    });

    this.messageConfig$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfig = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          JSONHeaderConfigsAddField,
          JSONHeaderConfigsUpdateField
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionCompleted(
          JSONHeaderConfigsAddField,
          JSONHeaderConfigsUpdateField
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false);
      });
  }

  isValueNotValid() {
    const stat =
      this.getFieldNameField()?.hasError('required') ||
      this.getLengthField()?.hasError('required') ||
      this.getSequenceField()?.hasError('required') ||
      this.getDataTypeField()?.hasError('required')
    return stat != null ? stat : true;
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    data.msgConfig = {configId: this.messageConfig?.configId};

    if (data.formatter?.formatterId)
      data.formatter = {formatterId: data.formatter?.formatterId};

    data.dataType = {typeId: data.dataType?.typeId};
    data.endpoint = {endpointId: this.endpointId};
    data.actions = this.actions;
    if (this.states == 'Request') {
      data.state = 1
    } else data.state = 2
    if (this.dialogMode == 'update') {
      data.id = this.selectedItem?.id;
      this.extIntJSONService.onUpdateHeaderConfigsField(data);
    } else this.extIntJSONService.onAddHeaderConfigsField(data);
  }

  onCloseActionDialog(stat: boolean) {
    this.visibleActionDialog = stat;
  }

  onAddActionBody(data: JsonActionDomain) {
    let existingData = this.actions.findIndex(
      (v1) => v1.sequence == data.sequence
    );
    if (this.actions[existingData]) {
      this.actions[existingData] = data;
      this.selectedAction = data
    } else {
      this.actions = [...this.actions, data];
    }
    if (this.dialogActionMode == 'add') {
      this.sequence += 1;
    }
  }

  onEditAction() {
    this.visibleActionDialog = true;
    this.dialogActionMode = 'update';
    this.componentMode = 'header'
  }

  onDeleteAction() {
    this.confirmService.showDialogConfirm(() => {
      let existingDataIndex = this.actions.findIndex(v1 => v1.sequence == this.selectedAction?.sequence)
      this.actions.splice(existingDataIndex, 1)
      this.selectedAction = undefined
    })
  }

  onDialogVisible() {
    this.isLoading.emit(true);
    this.extIntJSONService.onGetAllInformation((ctx) => {
      forkJoin([
        ctx.dispatch(new JSONFormatterGet()),
        ctx.dispatch(new JSONDataType()),
      ]).subscribe(() => {
        if (this.dialogMode == 'update') {
          this.setExistingDataToModel();
          this.isValueNotValid();
        }

        setTimeout(() => {
          this.isLoading.emit(false);
        }, 300);
      });
    });
  }

  setExistingDataToModel() {
    this.getFieldNameField()?.setValue(this.selectedItem?.fieldName);
    this.getLengthField()?.setValue(this.selectedItem?.length);
    this.getSequenceField()?.setValue(this.selectedItem?.sequence);
    this.getDataTypeField()?.setValue(this.selectedItem?.dataType);
    this.getFormatterField()?.setValue(this.selectedItem?.formatter);
    this.actions = this.selectedItem?.actions
    this.sequence = this.actions?.length > 0 ? this.sequence + 1 : 1
  }

  onAddActionDialog() {
    this.visibleActionDialog = true;
    this.componentMode = 'header';
    this.dialogActionMode = 'add';
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  getFieldNameField() {
    return this.form.get('fieldName');
  }

  getLengthField() {
    return this.form.get('length');
  }

  getSequenceField() {
    return this.form.get('sequence');
  }

  getDataTypeField() {
    return this.form.get('dataType');
  }

  getFormatterField() {
    return this.form.get('formatter');
  }
}
