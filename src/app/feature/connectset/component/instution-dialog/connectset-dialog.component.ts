import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConnectsetDomain} from "../../domain/connectset.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import { ConnectsetService } from '../../service/connectset.service';
import {ConnectsetAdd, ConnectsetUpdate} from "../../state/connectset.actions";

@Component({
  selector: 'app-connectset-dialog',
  templateUrl: './connectset-dialog.component.html',
  styleUrls: ['./connectset-dialog.component.css']
})
export class ConnectsetDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: ConnectsetDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private connectsetService: ConnectsetService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      connectsetName: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(ConnectsetAdd, ConnectsetUpdate),
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
      this.currentName = this.itemSelected != undefined ? this.itemSelected.connectsetName : ''

      this.getNameField()?.setValue(this.itemSelected?.connectsetName)
      this.getDescriptionField()?.setValue(this.itemSelected?.description)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.connectsetService.onUpdateConnectset(this.currentName, data)
    } else this.connectsetService.onAddConnectset(data)
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
    return this.form.get('connectsetName')
  }

  getDescriptionField() {
    return this.form.get('description')
  }
}

