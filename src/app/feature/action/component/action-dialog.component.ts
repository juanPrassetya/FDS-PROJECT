import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActionDomain} from "../domain/action.component";
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { ActionService } from '../service/action.service';
import { ActionAdd, ActionUpdate } from '../state/action.actions';

@Component({
  selector: 'app-action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.css']
})
export class ActionDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: ActionDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private actionService: ActionService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      actionName: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(ActionAdd, ActionUpdate),
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
      this.currentName = this.itemSelected != undefined ? this.itemSelected.actionName : ''

      this.getNameField()?.setValue(this.itemSelected?.actionName)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.actionService.onUpdateAction(this.currentName, data)
    } else this.actionService.onAddAction(data)
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
    return this.form.get('actionName')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}

