import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import { JSONActionType } from '../../state/ext-int-json.action';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { JsonActionTypeDomain } from '../../domain/json-action-type.domain';
import { Select } from '@ngxs/store';
import { ExtIntJSONState } from '../../state/ext-int-json.state';
import { JsonBodyFieldDomain } from '../../domain/json-body-field.domain';
import { JsonActionDomain } from '../../domain/json-action.domain';

@Component({
  selector: 'app-json-action-field-config-dialog',
  templateUrl: './json-action-field-config-dialog.component.html',
  styleUrls: ['./json-action-field-config-dialog.component.css'],
})
export class JsonActionFieldConfigDialogComponent implements OnInit, OnDestroy {
  @Select(ExtIntJSONState.actionTypes)
  actionTypes$!: Observable<JsonActionTypeDomain[]>;

  @Input() isOpen: boolean = true;
  @Input() dialogActionMode: string = 'add';
  @Input() componentMode: string = '';
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Input() selectedItem: any;
  @Output() onAddItem = new EventEmitter<JsonActionDomain>();
  @Output() onAddItemHeader = new EventEmitter<JsonActionDomain>();
  @Input() sequence: number = 1;

  protected readonly StringUtils = StringUtils;

  private destroyer$ = new Subject();

  form!: FormGroup;

  actionTypes: Array<JsonActionTypeDomain> = [];

  constructor(
    private fb: FormBuilder,
    private extIntJSONService: ExtIntJSONService
  ) {}
  ngOnDestroy(): void {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      actionId: [''],
      headerId: [''],
      type: ['', Validators.required],
      sequence: [''],
      args: ['', Validators.required],
    });

    this.actionTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.actionTypes = data;
    });
  }

  onSave(event: any) {
    let fixData = new JsonActionDomain();

    if (this.dialogActionMode == 'update') {
      if (this.selectedItem != undefined) {
        fixData.sequence = this.selectedItem?.sequence
          ? this.selectedItem.sequence
          : this.sequence;
        fixData.actionId = this.selectedItem?.actionId;
        fixData.fieldId = this.selectedItem?.fieldId;
      }
    } else {
      fixData.sequence = this.sequence;
    }
    fixData.type = event.type;
    fixData.args = event.args;

    this.onClose();
    if (this.componentMode == 'header') {
      this.onAddItemHeader.emit(fixData);
    } else this.onAddItem.emit(fixData);
  }

  isValueNotValid() {
    const condition =
      this.getActionTypeField()?.hasError('required')

    return condition ? true : false;
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  setExistingDataToModel() {
    this.getArgsField()?.setValue(this.selectedItem?.args);
    this.getActionTypeField()?.setValue(this.selectedItem?.type);
  }

  onDialogVisible() {
    this.isLoading.emit(true);
    this.extIntJSONService.onGetAllInformation((ctx) => {
      forkJoin([ctx.dispatch(new JSONActionType())]).subscribe(() => {
        if (this.dialogActionMode == 'update') {
          this.setExistingDataToModel();
          this.isValueNotValid();
        }

        setTimeout(() => {
          this.isLoading.emit(false);
        }, 300);
      });
    });
  }

  getArgsField() {
    return this.form.get('args');
  }

  getActionTypeField() {
    return this.form.get('type');
  }
}
