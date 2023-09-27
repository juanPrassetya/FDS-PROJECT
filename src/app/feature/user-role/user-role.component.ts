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
import { UserDomain } from '../user/domain/user.domain';
import { ConfirmService } from '../../shared/services/confirm.service';
import { AuthService } from '../../shared/services/auth.service';
import { StringUtils } from '../../shared/utils/string.utils';
import { UserRoleState } from './state/user-role.state';
import { UserRoleDomain } from './domain/user-role.domain';
import { UserRoleService } from './service/user-role.service';
import {
  UserRoleAdd,
  UserRoleDelete,
  UserRoleGet,
  UserRoleGetQuery,
  UserRoleUpdate,
} from './state/user-role.actions';
import { OperationDomain } from './domain/operation.domain';
import { TreeNode } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css'],
})
export class UserRoleComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(UserRoleState.data) roles$!: Observable<UserRoleDomain[]>;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup;

  selectedItem: UserRoleDomain | undefined;

  items: Array<UserRoleDomain> = [];
  operations: TreeNode[] = [];

  visibleUserRoleDialog: boolean = false;
  visibleUserRoleDetailDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private userRoleService: UserRoleService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      roleName: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(UserRoleState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.userRoleService.onFetchUserRole();
        }
      } else this.isLoading = false;
    });

    this.roles$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(UserRoleAdd, UserRoleUpdate, UserRoleDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.userRoleService.onFetchUserRole();
      });

    this.action$
      .pipe(
        ofActionErrored(UserRoleAdd, UserRoleUpdate, UserRoleDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(UserRoleGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(UserRoleGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(UserRoleGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.userRoleService.onFetchUserRole();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.userRoleService.onFetchUserRoleQuery(data);
          return
        }
      }
    }

    this.userRoleService.onFetchUserRole();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleUserRoleDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleUserRoleDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.userRoleService.onDeleteUserRole(Number(this.selectedItem?.roleId));
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleUserRoleDialog = stat;
  }

  onDetailClicked(item: any) {
    this.isLoading = true;
    this.selectedItem = item;
    this.operations.push(this.getOperationDetail());
    this.isLoading = false;
    this.visibleUserRoleDetailDialog = true;
  }

  onCloseDetail(stat: boolean) {
    this.visibleUserRoleDetailDialog = stat;
    this.operations = [];
  }

  getOperationDetail() {
    const operationDetail = {
      label: '',
      children: [
        {
          label: 'Operations',
          children: [
            {
              label: '',
            },
          ],
        },
      ],
    };
    try {
      if (this.selectedItem != undefined) {
        operationDetail.label =
          this.selectedItem.roleId + ' ' + this.selectedItem.roleName;
        operationDetail.children[0].children.pop();

        const sortedData = this.selectedItem.operations.sort((a, b) =>
          a.opName.localeCompare(b.opName)
        );
        sortedData.forEach((v1) => {
          operationDetail.children[0].children.push({
            label: v1.opName,
          });
        });
      }
    } catch (e) {
      console.log(e);
    }

    return operationDetail;
  }
}
