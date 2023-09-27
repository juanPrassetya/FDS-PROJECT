import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { AuthState } from '../../shared/auth/state/auth.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from './domain/user.domain';
import { ConfirmService } from '../../shared/services/confirm.service';
import { AuthService } from '../../shared/services/auth.service';
import { StringUtils } from '../../shared/utils/string.utils';
import { UserState } from './state/user.state';
import { UserService } from './service/user.service';
import {
  UserAdd,
  UserDelete,
  UserGet,
  UserGetQuery,
  UserUpdate,
} from './state/user.actions';
import { DateUtils } from '../../shared/utils/date.utils';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserGroupDomain } from '../user-group/domain/user-group.domain';
import { InstitutionDomain } from '../institution/domain/institution.domain';
import { UserRoleState } from '../user-role/state/user-role.state';
import { UserRoleDomain } from '../user-role/domain/user-role.domain';
import { UserGroupState } from '../user-group/state/user-group.state';
import { InstitutionState } from '../institution/state/institution.state';
import { ForkJoinHelper } from 'src/app/shared/utils/rxjs.utils';
import { RuleGet } from '../rule/state/rule.actions';
import { UserRoleGet } from '../user-role/state/user-role.actions';
import { UserGroupGet } from '../user-group/state/user-group.actions';
import { InstitutionGet } from '../institution/state/institution.actions';
import { UserRoleService } from '../user-role/service/user-role.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(UserState.data) users$!: Observable<UserDomain[]>;
  @Select(UserRoleState.data) roles$!: Observable<UserRoleDomain[]>;
  @Select(UserGroupState.userGroups) userGroup$!: Observable<UserGroupDomain[]>;
  @Select(InstitutionState.data) institutions$!: Observable<InstitutionDomain[]>;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  protected readonly DateUtils = DateUtils;

  authorities: string[] = [];
  formGroup!: FormGroup;

  selectedItem: UserDomain | undefined;

  items: Array<UserDomain> = [];
  userGroups: Array<UserGroupDomain> = [];
  institution: Array<InstitutionDomain> = [];
  role: Array<UserRoleDomain> = [];

  visibleUserDialog: boolean = false;
  visibleUserActionDialog: boolean = false;
  visibleResetDialog: boolean = false;
  visibleSearchDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  isActive = [
    { name: 'Active', code: true },
    { name: 'Not Active', code: true },
  ];
  locked = [
    { name: 'Yes', code: true },
    { name: 'No', code: true },
  ];
  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        { name: 'Group', type: 2, field: 'userGroup' },
        { name: 'Type', type: 3, field: 'type' },
        { name: 'Institution', type: 4, field: 'institution' },
      ],
    ],
    [
      1,
      [
        { name: 'Status', type: 5, field: 'status' },
        { name: 'Locked', type: 6, field: 'locked' },
        {},
      ],
    ],
  ]);

  constructor(
    private store$: Store,
    private action$: Actions,
    private userService: UserService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder,
    private roleService: UserRoleService
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      username: [''],
      email: [''],
      role: [''],
      userGroup: [''],
      type: [''],
      institution: [''],
      isActive: [''],
      isNotLocked: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(UserState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.userService.onGetUser();
          this.roleService.onFetchUserRole();
        }
      } else this.isLoading = false;
    });

    this.users$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.roles$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.role = data;
    });

    this.userGroup$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userGroups = data;
    });

    this.institutions$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.institution = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(UserAdd, UserUpdate, UserDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.userService.onGetUser();
      });

    this.action$
      .pipe(ofActionCompleted(UserGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(UserGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

      this.action$
      .pipe(ofActionErrored(UserGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete();
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.userService.onGetUser();
    this.visibleSearchDialog = false;
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    if(data.role) {
      data.role = data.role.roleId
    }
    if(data.userGroup) {
      data.userGroup = data.userGroup.id
    }
    if(data.institution) {
      data.institution = data.institution.id
    }
    if(data.isActive) {
      data.isActive = data.isActive.code;
    }
    if(data.isNotLocked) {
      data.isNotLocked = data.isNotLocked.code
    }
    if(data.type) {
      data.type = data.type.id
    }

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.userService.onGetUserQuery(data);
          return
        }
      }
    }

    this.userService.onGetUser();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleUserDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleUserDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.userService.onDeleteUser(Number(this.selectedItem?.id));
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleUserDialog = stat;
  }

  showAddtSearchFilter() {
    this.isLoading = true;
    this.userService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(new UserRoleGet()),
          ctx.dispatch(new UserGroupGet()),
          ctx.dispatch(new InstitutionGet())
        ],
        this.destroyer$,
        () => {
          this.visibleSearchDialog = !this.visibleSearchDialog;
          this.isLoading = false;
        }
      )
    })
  }

  onDetailClicked(item: any) {
    this.selectedItem = item;
    this.visibleUserActionDialog = true;
  }

  onCloseDetail(stat: boolean) {
    this.visibleUserActionDialog = stat;
  }

  onClickedReset() {
    this.visibleResetDialog = true;
  }
}
