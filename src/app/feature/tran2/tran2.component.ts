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
import { Tran2State } from './state/tran2.state';
import { Tran2Domain } from './domain/tran2.component';
import { Tran2Service } from './service/tran2.service';
import {
  Tran2Add,
  Tran2Delete,
  Tran2Get,
  Tran2GetQuery,
  Tran2Update,
} from './state/tran2.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tran2',
  templateUrl: './tran2.component.html',
  styleUrls: ['./tran2.component.css'],
})
export class Tran2Component implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(Tran2State.data) tran2s$!: Observable<
    Tran2Domain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedItem: Tran2Domain | undefined;

  items: Array<Tran2Domain> = [];

  visibleTran2Dialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private tran2Service: Tran2Service,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      tran2Name: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(Tran2State.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.tran2Service.onFetchTran2();
        }
      } else this.isLoading = false;
    });

    this.tran2s$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          Tran2Add,
          Tran2Update,
          Tran2Delete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.tran2Service.onFetchTran2();
      });

    this.action$
      .pipe(ofActionCompleted(Tran2Get), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionErrored(Tran2Add, Tran2Update, Tran2Delete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionCompleted(Tran2GetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(Tran2GetQuery), takeUntil(this.destroyer$))
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
    this.tran2Service.onFetchTran2();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.tran2Service.onFetchTran2Query(data);
          return
        }
      }
    }

    this.tran2Service.onFetchTran2();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleTran2Dialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleTran2Dialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.tran2Service.onDeleteTran2(
        Number(this.selectedItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleTran2Dialog = stat;
  }
}
