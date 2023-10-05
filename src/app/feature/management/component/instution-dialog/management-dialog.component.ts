import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ManagementDomain} from "../../domain/management.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import { ManagementService } from '../../service/management.service';
import {ManagementAdd, ManagementUpdate} from "../../state/management.actions";

@Component({
  selector: 'app-management-dialog',
  templateUrl: './management-dialog.component.html',
  styleUrls: ['./management-dialog.component.css']
})
export class ManagementDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: ManagementDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private managementService: ManagementService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      managementName: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(ManagementAdd, ManagementUpdate),
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
      this.currentName = this.itemSelected != undefined ? this.itemSelected.managementName : ''

      this.getNameField()?.setValue(this.itemSelected?.managementName)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.managementService.onUpdateManagement(this.currentName, data)
    } else this.managementService.onAddManagement(data)
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
    return this.form.get('managementName')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}

