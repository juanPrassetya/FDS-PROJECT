import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HeaderFieldDomain} from "../../domain/header-field.domain";
import {Observable, Subject, takeUntil} from "rxjs";
import {
  commonFieldTypeValidator,
  LLFieldTypeValidator, LLLFieldTypeValidator,
  maxFieldIdValidator,
  StringUtils
} from "../../../../shared/utils/string.utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {ExtIntISO8583Service} from "../../service/ext-int-iso8583.service";
import {HeaderFieldAdd, HeaderFieldUpdate} from "../../state/ext-int-iso8583.actions";
import {ExtIntISO8583State} from "../../state/ext-int-iso8583.state";
import {MessageConfigurationDomain} from "../../domain/message-configuration.domain";

@Component({
  selector: 'app-iso8583-header-field-dialog',
  templateUrl: './iso8583-header-field-dialog.component.html',
  styleUrls: ['./iso8583-header-field-dialog.component.css']
})
export class Iso8583HeaderFieldDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected!: HeaderFieldDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(ExtIntISO8583State.messageConfiguration) msgConfiguration$!: Observable<MessageConfigurationDomain>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  msgConfiguration: MessageConfigurationDomain | undefined

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntISO8583Service: ExtIntISO8583Service
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      fieldId: ['', [Validators.required, maxFieldIdValidator()]],
      description: [''],
      formatId: ['', Validators.required],
      encodingId: ['', Validators.required],
      priority: ['', Validators.required],
      length: ['', Validators.required],
    })

    this.msgConfiguration$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.msgConfiguration = data;
      })

    this.action$
      .pipe(
        ofActionSuccessful(HeaderFieldAdd, HeaderFieldUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(HeaderFieldAdd, HeaderFieldUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.form.reset()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    if (this.dialogMode == 'EDIT') {
      this.getFieldIdField()?.setValue(this.itemSelected?.fieldId)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
      this.getFormatField()?.setValue(this.itemSelected?.formatId)
      this.getEncodingField()?.setValue(this.itemSelected?.encodingId)
      this.getPriorityField()?.setValue(this.StringUtils.dummyPriority.find(v1 => v1.code == this.itemSelected?.priority))
      this.getLengthField()?.setValue(this.itemSelected?.length)

      if (this.getFormatField()?.getRawValue() != '' && this.getFormatField()?.getRawValue() != undefined)
        this.lengthValidator(this.getFormatField()?.getRawValue().formatType)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    if (this.msgConfiguration != undefined) {
      this.isLoading.emit(true)
      data.priority = data.priority.code
      data.configId = this.msgConfiguration

      if (this.dialogMode == 'EDIT') {
        data.id = this.itemSelected?.id
        this.extIntISO8583Service.onUpdateHeaderField(data)
      } else this.extIntISO8583Service.onAddHeaderField(data)
    }
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onFormatChange(value: any) {
    this.lengthValidator(value.value.formatType)
  }

  lengthValidator(value: any) {
    const type = value.split('L').length - 1

    switch (type) {
      case 0:
        this.getLengthField()?.setValidators([Validators.required, commonFieldTypeValidator()])
        break

      case 2:
        this.getLengthField()?.setValidators([Validators.required, LLFieldTypeValidator()])
        break

      case 3:
        this.getLengthField()?.setValidators([Validators.required, LLLFieldTypeValidator()])
        break

      default:
        this.getLengthField()?.setValidators([Validators.required])
        break

    }

    this.getLengthField()?.updateValueAndValidity()
  }

  isValueNotValid() {
    const stat = this.getFieldIdField()?.hasError('required') || this.getFormatField()?.hasError('required') ||
      this.getEncodingField()?.hasError('required') || this.getPriorityField()?.getRawValue() == '' || this.getLengthField()?.hasError('required')

    return stat != undefined ? stat : true
  }

  getFieldIdField() {
    return this.form.get('fieldId')
  }

  getDescriptionField() {
    return this.form.get('description')
  }

  getFormatField() {
    return this.form.get('formatId')
  }

  getEncodingField() {
    return this.form.get('encodingId')
  }

  getPriorityField() {
    return this.form.get('priority')
  }

  getLengthField() {
    return this.form.get('length')
  }
}
