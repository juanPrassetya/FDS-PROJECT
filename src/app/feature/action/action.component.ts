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
import { ActionState } from './state/action.state';
import { ActionDomain } from './domain/action.component';
import { ActionService } from './service/action.service';
import {
  ActionAdd,
  ActionDelete,
  ActionGet,
  ActionGetQuery,
  ActionUpdate,
} from './state/action.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
})
export class ActionComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ActionState.data) actions$!: Observable<
    ActionDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedItem: ActionDomain | undefined;

  items: Array<ActionDomain> = [];

  visibleActionDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private actionService: ActionService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      actionName: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(ActionState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.actionService.onFetchAction();
        }
      } else this.isLoading = false;
    });

    this.actions$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          ActionAdd,
          ActionUpdate,
          ActionDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.actionService.onFetchAction();
      });

    this.action$
      .pipe(ofActionCompleted(ActionGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionErrored(ActionAdd, ActionUpdate, ActionDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionCompleted(ActionGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(ActionGetQuery), takeUntil(this.destroyer$))
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
    this.actionService.onFetchAction();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.actionService.onFetchActionQuery(data);
          return
        }
      }
    }

    this.actionService.onFetchAction();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleActionDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleActionDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.actionService.onDeleteAction(
        Number(this.selectedItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleActionDialog = stat;
  }
}
