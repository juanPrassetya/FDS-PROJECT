import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {UserRoleDomain} from "../../domain/user-role.domain";
import {UserRoleState} from "../../state/user-role.state";
import {OperationDomain} from "../../domain/operation.domain";
import {UserRoleService} from "../../service/user-role.service";
import {UserRoleAdd, UserRoleUpdate} from "../../state/user-role.actions";

@Component({
  selector: 'app-user-role-dialog',
  templateUrl: './user-role-dialog.component.html',
  styleUrls: ['./user-role-dialog.component.css']
})
export class UserRoleDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: UserRoleDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(UserRoleState.operations) operations$!: Observable<OperationDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  operations: Array<OperationDomain> = []
  targetOperations: Array<OperationDomain> = []

  currentName: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private userRoleService: UserRoleService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      roleName: ['', Validators.required]
    })

    this.operations$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      if (this.dialogMode == 'EDIT') {
        if (this.itemSelected != undefined) {
          this.operations = data.filter(v1 => {
            return !this.itemSelected?.operations.some(v2 => {
              return v1.opName == v2.opName
            })
          })
        }
      } else this.operations = data;
    })

    this.action$
      .pipe(
        ofActionSuccessful(UserRoleAdd, UserRoleUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    // this.action$
    // //   .pipe(
    // //     ofActionCompleted(UserRoleAdd, UserRoleUpdate),
    // //     takeUntil(this.destroyer$)
    // //   ).subscribe(() => {
    // //   this.isLoading.emit(false)
    // // })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.getOperation()

    if (this.dialogMode == 'EDIT') {
      this.currentName = this.itemSelected != undefined ? this.itemSelected.roleName : ''

      if (this.itemSelected != undefined) {
        this.getNameField()?.setValue(this.itemSelected?.roleName)
        this.targetOperations = [...this.itemSelected?.operations]
      }
    }

    this.isLoading.emit(false)
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    data.operations = this.targetOperations

    if (this.dialogMode == 'EDIT') {
      this.userRoleService.onUpdateUserRole(this.currentName, data)
    } else this.userRoleService.onAddUserRole(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  getOperation() {
    this.userRoleService.onFetchOperation()
  }

  isValueNotValid() {
    const stat = this.getNameField()?.getRawValue() == '' || this.targetOperations.length == 0
    return stat != undefined ? stat : true
  }

  getNameField() {
    return this.form.get('roleName')
  }
}
