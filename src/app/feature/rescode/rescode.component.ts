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
import { RescodeState } from './state/rescode.state';
import { RescodeDomain } from './domain/rescode.domain';
import { RescodeService } from './service/rescode.service';
import {
  RescodeAdd,
  RescodeDelete,
  RescodeGet,
  RescodeGetQuery,
  RescodeUpdate,
} from './state/rescode.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rescode',
  templateUrl: './rescode.component.html',
  styleUrls: ['./rescode.component.css'],
})
export class RescodeComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(RescodeState.data) rescodes$!: Observable<
    RescodeDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedItem: RescodeDomain | undefined;

  items: Array<RescodeDomain> = [];

  visibleRescodeDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private rescodeService: RescodeService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      rescodeName: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(RescodeState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.rescodeService.onFetchRescode();
        }
      } else this.isLoading = false;
    });

    this.rescodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          RescodeAdd,
          RescodeUpdate,
          RescodeDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.rescodeService.onFetchRescode();
      });

    this.action$
      .pipe(ofActionCompleted(RescodeGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionErrored(RescodeAdd, RescodeUpdate, RescodeDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionCompleted(RescodeGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(RescodeGetQuery), takeUntil(this.destroyer$))
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
    this.rescodeService.onFetchRescode();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.rescodeService.onFetchRescodeQuery(data);
          return
        }
      }
    }

    this.rescodeService.onFetchRescode();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleRescodeDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleRescodeDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.rescodeService.onDeleteRescode(
        Number(this.selectedItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleRescodeDialog = stat;
  }
}
