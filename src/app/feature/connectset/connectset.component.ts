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
import { ConnectsetState } from './state/connectset.state';
import { ConnectsetDomain } from './domain/connectset.domain';
import { ConnectsetService } from './service/connectset.service';
import {
  ConnectsetAdd,
  ConnectsetDelete,
  ConnectsetGet,
  ConnectsetGetQuery,
  ConnectsetUpdate,
} from './state/connectset.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-connectset',
  templateUrl: './connectset.component.html',
  styleUrls: ['./connectset.component.css'],
})
export class ConnectsetComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ConnectsetState.data) connectsets$!: Observable<
    ConnectsetDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedItem: ConnectsetDomain | undefined;

  items: Array<ConnectsetDomain> = [];

  visibleConnectsetDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private connectsetService: ConnectsetService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      connectsetName: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(ConnectsetState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.connectsetService.onFetchConnectset();
        }
      } else this.isLoading = false;
    });

    this.connectsets$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          ConnectsetAdd,
          ConnectsetUpdate,
          ConnectsetDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.connectsetService.onFetchConnectset();
      });

    this.action$
      .pipe(ofActionCompleted(ConnectsetGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionErrored(ConnectsetAdd, ConnectsetUpdate, ConnectsetDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionCompleted(ConnectsetGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(ConnectsetGetQuery), takeUntil(this.destroyer$))
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
    this.connectsetService.onFetchConnectset();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.connectsetService.onFetchConnectsetQuery(data);
          return
        }
      }
    }

    this.connectsetService.onFetchConnectset();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleConnectsetDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleConnectsetDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.connectsetService.onDeleteConnectset(
        Number(this.selectedItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleConnectsetDialog = stat;
  }
}
