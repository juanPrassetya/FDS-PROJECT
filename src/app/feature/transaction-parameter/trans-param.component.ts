import { Component, OnInit } from '@angular/core';
import { ResponseCodeState } from '../response-code/state/response-code.state';
import { TransParamDomain } from './domain/trans-param.domain';
import { Select, Store, Actions, ofActionSuccessful, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { UserDomain } from '../user/domain/user.domain';
import {
  TransParamAdd,
  TransParamUpdate,
  TransParamDelete,
  TransParamGet,
  TransParamGetCommon,
  TransParamGetQuery
} from './state/trans-param.actions';
import { TransParamState } from './state/trans-param.state';
import { TransParamService } from './service/trans-param.service';
import { MessageConfigurationDomain } from '../ext-int-iso8583/domain/message-configuration.domain';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-trans-param',
  templateUrl: './trans-param.component.html',
  styleUrls: ['./trans-param.component.css']
})
export class TransParamComponent implements OnInit {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(TransParamState.transParamsCommon) TransParams$!: Observable<TransParamDomain[]>

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];
  formGroup!: FormGroup

  selectedTransParamItem!: TransParamDomain | undefined

  TransParamItems: Array<TransParamDomain> = []

  visibleTransParamDialog: boolean = false
  visibleTransParamDetailDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
    private TransParamService: TransParamService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      configId: [''],
      attribute: [''],
      fieldTag: [''],
      description: ['']
    })
     this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(TransParamState.transParamsCommon).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.TransParamService.onFetchAllTransParamCommon()
        }
      } else this.isLoading = false
    })

    this.TransParams$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.TransParamItems = data;
      })

    this.action$.pipe(
      ofActionSuccessful(TransParamAdd, TransParamUpdate, TransParamDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedTransParamItem = undefined
      this.TransParamService.onFetchAllTransParamCommon()
    })

    this.action$.pipe(
      ofActionCompleted(TransParamGetCommon, TransParamAdd, TransParamUpdate, TransParamDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    
    this.action$.pipe(
      ofActionCompleted(TransParamGetQuery),
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

  onSearchClicked(data: any) {
    this.isLoading = true;
    data.notificationType = data.notificationType.id
    data.configId = data.configId.id
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.TransParamService.onFetchTransParamQuery(data);
          return
        }
      }
    }

    this.TransParamService.onFetchAllTransParamCommon();
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedTransParamItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleTransParamDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleTransParamDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.TransParamService.onDeleteTransParam(Number(this.selectedTransParamItem?.attrId))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleTransParamDialog = stat
  }
}
