import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RescodeDomain} from "../../domain/rescode.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import { RescodeService } from '../../service/rescode.service';
import {RescodeAdd, RescodeUpdate} from "../../state/rescode.actions";

@Component({
  selector: 'app-rescode-dialog',
  templateUrl: './rescode-dialog.component.html',
  styleUrls: ['./rescode-dialog.component.css']
})
export class RescodeDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: RescodeDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private rescodeService: RescodeService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      rescodeName: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(RescodeAdd, RescodeUpdate),
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
      this.currentName = this.itemSelected != undefined ? this.itemSelected.rescodeName : ''

      this.getNameField()?.setValue(this.itemSelected?.rescodeName)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.rescodeService.onUpdateRescode(this.currentName, data)
    } else this.rescodeService.onAddRescode(data)
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
    return this.form.get('rescodeName')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}

