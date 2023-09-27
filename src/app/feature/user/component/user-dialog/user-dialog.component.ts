import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select} from "@ngxs/store";
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {UserDomain} from "../../domain/user.domain";
import {UserRoleDomain} from "../../../user-role/domain/user-role.domain";
import {UserRoleState} from "../../../user-role/state/user-role.state";
import {InstitutionState} from "../../../institution/state/institution.state";
import {InstitutionDomain} from "../../../institution/domain/institution.domain";
import {UserGroupState} from "../../../user-group/state/user-group.state";
import {UserGroupDomain} from "../../../user-group/domain/user-group.domain";
import {UserService} from "../../service/user.service";
import {UserAdd, UserGetAllInformation, UserUpdate} from "../../state/user.actions";
import {RuleGet} from "../../../rule/state/rule.actions";
import {UserRoleGet} from "../../../user-role/state/user-role.actions";
import {InstitutionGet} from "../../../institution/state/institution.actions";
import {UserGroupGet} from "../../../user-group/state/user-group.actions";

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: UserDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(UserRoleState.data) roles$!: Observable<UserRoleDomain[]>
  @Select(InstitutionState.data) institutions$!: Observable<InstitutionDomain[]>
  @Select(UserGroupState.userGroups) userGroups$!: Observable<UserGroupDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  roles: Array<UserRoleDomain> = []
  institutions: Array<InstitutionDomain> = []
  userGroups: Array<UserGroupDomain> = []
  dummyUserType = StringUtils.dummyUserType
  dummyStatus = StringUtils.dummyStatus
  dummyOption = StringUtils.dummyOption

  currentUsername: string = ''

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      type: ['', Validators.required],
      role: ['', Validators.required],
      institution: ['', Validators.required],
      userGroup: ['', Validators.required],
      active: ['', Validators.required],
      notLocked: ['', Validators.required],
    })

    this.roles$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.roles = data
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getRoleField()?.setValue(this.roles.find(v1 => v1.roleId == this.itemSelected?.role.roleId))
      }
    })

    this.institutions$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.institutions = data
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getInstitutionField()?.setValue(this.institutions.find(v1 => v1.id == this.itemSelected?.institution?.id))
      }
    })

    this.userGroups$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userGroups = data
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getGroupField()?.setValue(this.userGroups.find(v1 => v1.id == this.itemSelected?.userGroup?.id))
      }
    })

    this.action$
      .pipe(
        ofActionSuccessful(UserAdd, UserUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    this.action$
      .pipe(
        ofActionErrored(UserAdd, UserUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.isLoading.emit(false) })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(UserAdd, UserUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })

    // this.action$.pipe(
    //   ofActionCompleted(UserGetAllInformation),
    //   takeUntil(this.destroyer$)
    // ).subscribe(() => {
    //   this.isLoading.emit(false)
    // })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)
    this.userService.onGetAllInformation(
      (ctx) => {
        forkJoin([
          ctx.dispatch(new UserRoleGet()),
          ctx.dispatch(new InstitutionGet()),
          ctx.dispatch(new UserGroupGet())
        ]).subscribe(() => {
          if (this.dialogMode == 'EDIT') {
            this.currentUsername = this.itemSelected != undefined ? this.itemSelected.username : ''

            this.getFirstnameField()?.setValue(this.itemSelected?.firstName)
            this.getLastnameField()?.setValue(this.itemSelected?.lastName)
            this.getUsernameField()?.setValue(this.itemSelected?.username)
            this.getEmailField()?.setValue(this.itemSelected?.email)
            this.getUserTypeField()?.setValue(this.dummyUserType.find(v1 => v1.typeName == this.itemSelected?.type?.typeName))
            this.getStatusField()?.setValue(this.dummyStatus.find(v1 => v1.code == this.itemSelected?.active))
            this.getLockField()?.setValue(this.dummyOption.find(v1 => v1.code == !this.itemSelected?.notLocked))
          }

          this.isLoading.emit(false)
        })
      }
    )
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    data.active = data.active.code
    data.notLocked = !data.notLocked.code

    if (this.dialogMode == 'EDIT') {
      this.userService.onUpdateUser(this.currentUsername, data)
    } else this.userService.onAddUser(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getFirstnameField()?.getRawValue() == '' || this.getLastnameField()?.hasError('required') ||
      this.getUsernameField()?.hasError('required') || this.getEmailField()?.hasError('required') || this.getUserTypeField()?.hasError('required') ||
      this.getRoleField()?.hasError('required') || this.getInstitutionField()?.hasError('required') || this.getGroupField()?.hasError('required') ||
      this.getStatusField()?.hasError('required') || this.getLockField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getFirstnameField() {
    return this.form.get('firstName')
  }

  getLastnameField() {
    return this.form.get('lastName')
  }

  getUsernameField() {
    return this.form.get('username')
  }

  getEmailField() {
    return this.form.get('email')
  }

  getUserTypeField() {
    return this.form.get('type')
  }

  getRoleField() {
    return this.form.get('role')
  }

  getInstitutionField() {
    return this.form.get('institution')
  }

  getGroupField() {
    return this.form.get('userGroup')
  }

  getStatusField() {
    return this.form.get('active')
  }

  getLockField() {
    return this.form.get('notLocked')
  }
}
