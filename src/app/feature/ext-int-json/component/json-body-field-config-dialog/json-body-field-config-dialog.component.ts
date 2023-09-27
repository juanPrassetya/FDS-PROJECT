import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Select,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
} from '@ngxs/store';
import { Observable, Subject, takeUntil, forkJoin } from 'rxjs';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { JsonFieldTypeDomain } from '../../domain/json-field-type.domain';
import { JsonFormatterDomain } from '../../domain/json-formatter.domain';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import {
  JSONHeaderConfigsAddField,
  JSONHeaderConfigsUpdateField,
  JSONFormatterGet,
  JSONDataType,
  JSONBodyConfigsAddField,
  JSONBodyConfigsUpdateField,
} from '../../state/ext-int-json.action';
import { ExtIntJSONState } from '../../state/ext-int-json.state';
import { JsonActionDomain } from '../../domain/json-action.domain';
import { ConfirmService } from 'src/app/shared/services/confirm.service';

@Component({
  selector: 'app-json-body-field-config-dialog',
  templateUrl: './json-body-field-config-dialog.component.html',
  styleUrls: ['./json-body-field-config-dialog.component.css'],
})
export class JsonBodyFieldConfigDialogComponent implements OnInit, OnDestroy {
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
  @Input() childConfigId!: number;
  @Input() levelConfig!: number;
  @Input() prevParentField!: number;

  private destroyer$ = new Subject();

  protected readonly StringUtils = StringUtils;

  formatters: Array<JsonFormatterDomain> = [];
  dataTypes: Array<JsonFieldTypeDomain> = [];
  messageConfig: MessageConfigurationDomain | undefined;

  selectedAction: any | undefined;
  visibleActionDialog: boolean = false;
  actions: JsonActionDomain[] = [];
  sequence: number = 1;
  componentMode: string = '';
  dialogActionMode: string = 'add';

  form!: FormGroup;
  level: number = 0;

  state = [
    { name: 'Request', code: 1 },
    { name: 'Response', code: 2 },
  ];

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntJSONService: ExtIntJSONService,
    private confirmService: ConfirmService
  ) {}
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
      level: [''],
      validValues: [],
      state: [],
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
        ofActionSuccessful(JSONBodyConfigsAddField, JSONBodyConfigsUpdateField),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionCompleted(JSONBodyConfigsAddField, JSONBodyConfigsUpdateField),
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

    data.msgConfig = { configId: this.messageConfig?.configId };
    data.formatter = { formatterId: data.formatter?.formatterId };
    data.dataType = { typeId: data.dataType?.typeId };
    data.endpoint = { endpointId: this.endpointId };
    data.actions = this.actions;

    data.state = this.states === 'Request' ? 1 : 2;

    if (this.dialogMode == 'update') {
      this.handleUpdate(data);
    } else {
      this.handleAdd(data);
    }
  }

  onAddAction(data: JsonActionDomain) {
    let existingData = this.actions.findIndex(
      (v1) => v1.sequence == data.sequence
    );
    if (this.actions[existingData]) {
      this.actions[existingData] = data;
    } else {
      this.actions = [...this.actions, data];
    }
    if (this.dialogActionMode == 'add') {
      this.sequence += 1;
    }
  }

  handleUpdate(data: any) {
    data.id = this.selectedItem?.id;
    data.level = this.levelConfig;
    if (data.level > 1) {
      data.parentField = this.prevParentField;
    }
    this.extIntJSONService.onUpdateBodyConfigField(data);
  }

  handleAdd(data: any) {
    this.level = this.levelConfig >= 1 ? this.levelConfig + 1 : 1;
    data.level = this.level;
    data.parentField = this.level > 1 ? this.childConfigId : undefined;

    this.extIntJSONService.onAddBodyConfigField(data);
  }

  onEditAction() {
    this.visibleActionDialog = true;
    this.dialogActionMode = 'update';
    this.componentMode = 'body'
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
    this.sequence = this.actions.length > 0 ? this.sequence + 1 :  1
  }

  onAddActionDialog() {
    this.visibleActionDialog = true;
    this.componentMode = 'body';
    this.dialogActionMode = 'add';
  }

  selectedActionBtn(event: any) {
    console.log(event)
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  onCloseActionDialog(stat: boolean) {
    this.visibleActionDialog = stat;
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
