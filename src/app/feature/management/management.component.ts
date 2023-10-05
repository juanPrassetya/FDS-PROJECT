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
import { ManagementState } from './state/management.state';
import { ManagementDomain } from './domain/management.domain';
import { ManagementService } from './service/management.service';
import {
  ManagementAdd,
  ManagementDelete,
  ManagementGet,
  ManagementGetQuery,
  ManagementUpdate,
} from './state/management.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
})
export class ManagementComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ManagementState.data) managements$!: Observable<
    ManagementDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedItem: ManagementDomain | undefined;

  items: Array<ManagementDomain> = [];

  visibleManagementDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private managementService: ManagementService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      managementName: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(ManagementState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.managementService.onFetchManagement();
        }
      } else this.isLoading = false;
    });

    this.managements$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          ManagementAdd,
          ManagementUpdate,
          ManagementDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.managementService.onFetchManagement();
      });

    this.action$
      .pipe(ofActionCompleted(ManagementGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionErrored(ManagementAdd, ManagementUpdate, ManagementDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionCompleted(ManagementGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(ManagementGetQuery), takeUntil(this.destroyer$))
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
    this.managementService.onFetchManagement();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.managementService.onFetchManagementQuery(data);
          return
        }
      }
    }

    this.managementService.onFetchManagement();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleManagementDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleManagementDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.managementService.onDeleteManagement(
        Number(this.selectedItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleManagementDialog = stat;
  }
}
