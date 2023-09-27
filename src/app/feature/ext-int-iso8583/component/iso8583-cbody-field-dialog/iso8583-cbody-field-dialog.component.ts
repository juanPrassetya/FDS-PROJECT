import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BodyFieldDomain} from "../../domain/body-field.domain";
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtIntISO8583Service} from "../../service/ext-int-iso8583.service";
import {BodyFieldUpdate, ChildBodyFieldAdd, ChildBodyFieldUpdate} from "../../state/ext-int-iso8583.actions";
import {
  commonFieldTypeValidator,
  LLFieldTypeValidator,
  LLLFieldTypeValidator, maxFieldIdValidator,
  StringUtils
} from "../../../../shared/utils/string.utils";
import {ChildBodyFieldDomain} from "../../domain/child-body-field.domain";

@Component({
  selector: 'app-iso8583-cbody-field-dialog',
  templateUrl: './iso8583-cbody-field-dialog.component.html',
  styleUrls: ['./iso8583-cbody-field-dialog.component.css']
})
export class Iso8583CbodyFieldDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() parentSelected!: BodyFieldDomain | undefined
  @Input() itemSelected!: ChildBodyFieldDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  fieldFormat: any[] = []
  fieldEncoding: any[] = []

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
      isTlvFormat: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(ChildBodyFieldAdd),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      if (this.parentSelected?.subFieldConfigurations.length == 0) {
        this.parentSelected.subFieldConfigurations.push(new ChildBodyFieldDomain())
        this.extIntISO8583Service.onGetBodyField(Number(this.parentSelected.configId.configId))
      }
      this.onClose()
    })

    this.action$
      .pipe(
        ofActionSuccessful(ChildBodyFieldUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(ChildBodyFieldAdd, ChildBodyFieldUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => {
    //   this.isLoading.emit(false)
    // })
  }

  ngOnDestroy() {
    this.form.reset()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    if (this.dialogMode == 'EDIT') {
      this.isLoading.emit(true)
      this.getFieldIdField()?.setValue(this.itemSelected?.fieldId)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
      this.getFormatField()?.setValue(this.itemSelected?.formatId)
      this.getEncodingField()?.setValue(this.itemSelected?.encodingId)
      this.getPriorityField()?.setValue(this.StringUtils.dummyPriority.find(v1 => v1.code == this.itemSelected?.priority))
      this.getLengthField()?.setValue(this.itemSelected?.length)
      this.getFieldTypeField()?.setValue(this.StringUtils.dummyFieldType.find(v1 => v1.code == this.itemSelected?.isTlvFormat))

      if (this.getFieldTypeField()?.getRawValue().code == true) {
        this.fieldFormat = StringUtils.dummyTLVFormat
        this.fieldEncoding = StringUtils.dummyTlvEncoding
      } else {
        this.fieldFormat = StringUtils.dummyCommonFormat
        this.fieldEncoding = StringUtils.dummyCommonEncoding
      }

      if (this.getFormatField()?.getRawValue() != '' && this.getFormatField()?.getRawValue() != undefined)
        this.lengthValidator(this.getFormatField()?.getRawValue().formatType)

      this.isLoading.emit(false)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    if (this.parentSelected != undefined) {
      this.isLoading.emit(true)
      data.priority = data.priority.code

      this.parentSelected.subFieldConfigurations = []
      data.parentId = this.parentSelected

      data.isTlvFormat = data.isTlvFormat.code

      if (this.dialogMode == 'EDIT') {
        data.id = this.itemSelected?.id
        this.extIntISO8583Service.onUpdateChildBodyField(data)
      } else this.extIntISO8583Service.onAddChildBodyField(data)
    }
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onFieldTypeChange(value: any) {
    this.getFormatField()?.reset()
    this.getEncodingField()?.reset()
    this.fieldFormat = this.StringUtils.getFieldFormat(value.value.code)
    this.fieldEncoding = this.StringUtils.getFieldEncoding(value.value.code)
  }

  onFormatChange(value: any) {
    this.lengthValidator(value.value.formatType)
  }

  lengthValidator(value: any) {

    if (!value.includes('TLV')) {
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
    } else {
      switch (value) {
        case 'LLTLV':
          this.getLengthField()?.setValidators([Validators.required, LLFieldTypeValidator()])
          break

        case 'LLLTLV':
          this.getLengthField()?.setValidators([Validators.required, LLLFieldTypeValidator()])
          break
      }
    }

    this.getLengthField()?.updateValueAndValidity()
  }

  isValueNotValid() {
    const stat = this.getFieldIdField()?.hasError('required') || this.getFormatField()?.hasError('required') || this.getLengthField()?.hasError('required') ||
      this.getEncodingField()?.hasError('required') || this.getPriorityField()?.getRawValue() == '' || this.getFieldTypeField()?.getRawValue() == ''

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

  getFieldTypeField() {
    return this.form.get('isTlvFormat')
  }
}
