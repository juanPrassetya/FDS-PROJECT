import { Component, OnInit } from '@angular/core';
import { AidParameterState } from './state/aid-parameter.state';
import { AidParameterDomain } from './domain/aid-parameter.domain';
import { AidParameterService } from './service/aid-parameter.service';
import { Select, Store, Actions, ofActionSuccessful, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { StringUtils } from 'src/app/shared/utils/string.utils';

import { UserDomain } from '../user/domain/user.domain';
import { AidParameterAdd, AidParameterDelete, AidParameterGet, AidParameterUpdate } from './state/aid-parameter.action';

@Component({
  selector: 'app-aid-parameter',
  templateUrl: './aid-parameter.component.html',
  styleUrls: ['./aid-parameter.component.css']
})
export class AidParameterComponent implements OnInit {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(AidParameterState.aidParam) aidParam$!: Observable<AidParameterDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];

  selectedAidParamItem!: AidParameterDomain | undefined

  AidParamItems: Array<AidParameterDomain> = []

  visibleAidParamDialog: boolean = false
  visibleAidParamDetailDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
    private aidParamService: AidParameterService,
    private confirmService: ConfirmService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
     this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(AidParameterState.aidParam).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.aidParamService.onGetAidDispatch()
        }
      } else this.isLoading = false
    })

    this.aidParam$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.AidParamItems = data;
      })

    this.action$.pipe(
      ofActionSuccessful(AidParameterAdd, AidParameterUpdate, AidParameterDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedAidParamItem = undefined
      this.aidParamService.onGetAidDispatch()
    })

    this.action$.pipe(
      ofActionCompleted(AidParameterGet, AidParameterAdd, AidParameterUpdate, AidParameterDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onSearchClicked() {
    this.isLoading = true
    this.aidParamService.onGetAidDispatch()
    this.selectedAidParamItem = undefined
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedAidParamItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleAidParamDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleAidParamDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.aidParamService.onDeleteAidDispatch(Number(this.selectedAidParamItem?.id))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleAidParamDialog = stat
  }
}
