import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Actions, ofActionCompleted, ofActionSuccessful} from "@ngxs/store";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {UserGroupDomain} from "../../domain/user-group.domain";
import {UserGroupService} from "../../service/user-group.service";
import {UserGroupAdd, UserGroupUpdate} from "../../state/user-group.actions";

@Component({
  selector: 'app-user-group-dialog',
  templateUrl: './user-group-dialog.component.html',
  styleUrls: ['./user-group-dialog.component.css']
})
export class UserGroupDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: UserGroupDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private userGroupService: UserGroupService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      groupName: ['', Validators.required],
    })

    this.action$
      .pipe(
        ofActionSuccessful(UserGroupAdd, UserGroupUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(UserGroupAdd, UserGroupUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => {
    //   this.isLoading.emit(false)
    // })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    if (this.dialogMode == 'EDIT') {
      this.currentName = this.itemSelected != undefined ? this.itemSelected.groupName : ''

      this.getNameField()?.setValue(this.itemSelected?.groupName)
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.userGroupService.onUpdateUserGroup(this.currentName, data)
    } else this.userGroupService.onAddUserGroup(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getNameField()?.getRawValue() == ''
    return stat != undefined ? stat : true
  }

  getNameField() {
    return this.form.get('groupName')
  }
}
