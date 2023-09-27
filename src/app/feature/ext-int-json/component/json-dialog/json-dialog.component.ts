import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {MessageConfigurationAdd} from "../../../ext-int-iso8583/state/ext-int-iso8583.actions";
import {MessageConfigurationDomain} from "../../../ext-int-iso8583/domain/message-configuration.domain";
import {ExtIntJSONService} from "../../service/ext-int-json.service";

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
  styleUrls: ['./json-dialog.component.css']
})
export class JsonDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  form!: FormGroup;
  dummyStatus = StringUtils.dummyStatus
  dummyType = [
    {
      msgId: 2,
      name: 'JSON'
    }
  ]

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private extIntJSONService: ExtIntJSONService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      msgType: ['', Validators.required],
      hasHeader: ['', Validators.required],
      description: [''],
    })

    this.action$
      .pipe(
        ofActionSuccessful(MessageConfigurationAdd),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(MessageConfigurationAdd),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(value: any) {
    this.isLoading.emit(true)

    const fixData = new MessageConfigurationDomain()
    fixData.name = value.name
    fixData.msgType = value.msgType
    fixData.hasHeader = value.hasHeader.code
    fixData.description = value.description

    this.extIntJSONService.onAddMessageConfiguration(fixData)
  }

  isValueNotValid() {
    const stat = this.getNameField()?.hasError('required') || this.getTypeField()?.hasError('required')
    this.getHeaderField()?.hasError('required') || this.getDescriptionField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getNameField() {
    return this.form.get('name')
  }

  getTypeField() {
    return this.form.get('msgType')
  }

  getHeaderField() {
    return this.form.get('hasHeader')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}
