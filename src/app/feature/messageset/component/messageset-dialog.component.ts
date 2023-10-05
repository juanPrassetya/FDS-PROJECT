import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessagesetDomain} from "../domain/messageset.component";
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { MessagesetService } from '../service/messageset.service';
import { MessagesetAdd, MessagesetUpdate } from '../state/messageset.actions';

@Component({
  selector: 'app-messageset-dialog',
  templateUrl: './messageset-dialog.component.html',
  styleUrls: ['./messageset-dialog.component.css']
})
export class MessagesetDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: MessagesetDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private messagesetService: MessagesetService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      messagesetName: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(MessagesetAdd, MessagesetUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(InstitutionAdd, InstitutionUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    if (this.dialogMode == 'EDIT') {
      this.currentName = this.itemSelected != undefined ? this.itemSelected.messagesetName : ''

      this.getNameField()?.setValue(this.itemSelected?.messagesetName)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.messagesetService.onUpdateMessageset(this.currentName, data)
    } else this.messagesetService.onAddMessageset(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getNameField()?.getRawValue() == '' || this.getDescriptionField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getNameField() {
    return this.form.get('messagesetName')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}

