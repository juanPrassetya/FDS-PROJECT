import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../user/domain/user.domain";
import {ConfirmService} from "../../shared/services/confirm.service";
import {AuthService} from "../../shared/services/auth.service";
import {StringUtils} from "../../shared/utils/string.utils";
import {UserGroupDomain} from "./domain/user-group.domain";
import {UserGroupState} from "./state/user-group.state";
import {UserGroupService} from "./service/user-group.service";
import {UserGroupAdd, UserGroupDelete, UserGroupGet, UserGroupGetQuery, UserGroupUpdate} from "./state/user-group.actions";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css']
})
export class UserGroupComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(UserGroupState.userGroups) userGroups$!: Observable<UserGroupDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup

  selectedItem: UserGroupDomain | undefined

  items: Array<UserGroupDomain> = []

  visibleUserGroupDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private userGroupService: UserGroupService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      groupName: ['']
    })
    this.authorities = this.authService.getAuthorities()

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(UserGroupState.userGroups).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.userGroupService.onFetchAllUserGroup()
        }
      } else this.isLoading = false
    })

    this.userGroups$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.items = data;
    })

    this.action$.pipe(
      ofActionSuccessful(UserGroupAdd, UserGroupUpdate, UserGroupDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedItem = undefined
      this.userGroupService.onFetchAllUserGroup()
    })

    this.action$.pipe(
      ofActionCompleted(UserGroupGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(UserGroupGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionErrored(UserGroupAdd, UserGroupUpdate, UserGroupDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
      .pipe(ofActionErrored(UserGroupGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.userGroupService.onFetchAllUserGroup();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.userGroupService.onFetchAllUserGroupQuery(data);
          return
        }
      }
    }

    this.userGroupService.onFetchAllUserGroup();
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleUserGroupDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleUserGroupDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.userGroupService.onDeleteUserGroup(Number(this.selectedItem?.id))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleUserGroupDialog = stat
  }
}
