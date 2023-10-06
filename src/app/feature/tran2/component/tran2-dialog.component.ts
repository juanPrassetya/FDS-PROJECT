import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Tran2Domain} from "../domain/tran2.component";
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { Tran2Service } from '../service/tran2.service';
import { Tran2Add, Tran2Update } from '../state/tran2.actions';

@Component({
  selector: 'app-tran2-dialog',
  templateUrl: './tran2-dialog.component.html',
  styleUrls: ['./tran2-dialog.component.css']
})
export class Tran2DialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: Tran2Domain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private tran2Service: Tran2Service
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      tran2Name: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(Tran2Add, Tran2Update),
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
      this.currentName = this.itemSelected != undefined ? this.itemSelected.tran2Name : ''

      this.getNameField()?.setValue(this.itemSelected?.tran2Name)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.tran2Service.onUpdateTran2(this.currentName, data)
    } else this.tran2Service.onAddTran2(data)
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
    return this.form.get('tran2Name')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}

