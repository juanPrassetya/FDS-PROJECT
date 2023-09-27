import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Select, Store, Actions, ofActionSuccessful, ofActionCompleted, ofActionErrored } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TransParamDomain } from 'src/app/feature/transaction-parameter/domain/trans-param.domain';
import { TransParamService } from 'src/app/feature/transaction-parameter/service/trans-param.service';
import { TransParamAdd, TransParamUpdate, TransParamDelete, TransParamGetCommon, TransParamGetQuery, TransParamGetById } from 'src/app/feature/transaction-parameter/state/trans-param.actions';
import { TransParamState } from 'src/app/feature/transaction-parameter/state/trans-param.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { MessageConfigurationDomain } from '../../domain/message-configuration.domain';
import { ExtIntISO8583State } from '../../state/ext-int-iso8583.state';

@Component({
  selector: 'app-iso8583-transaction-param',
  templateUrl: './iso8583-transaction-param.component.html',
  styleUrls: ['./iso8583-transaction-param.component.css']
})
export class Iso8583TransactionParamComponent implements OnInit {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(TransParamState.transParams) TransParams$!: Observable<TransParamDomain[]>
  @Select(ExtIntISO8583State.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];
  formGroup!: FormGroup

  selectedTransParamItem!: TransParamDomain | undefined
  messageConfiguration: MessageConfigurationDomain | undefined

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
      attribute: [''],
      fieldTag: [''],
    })
     this.authorities = this.authService.getAuthorities();
    this.TransParams$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        console.log(data)
        this.TransParamItems = data;
      })

      this.messageConfigurations$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.messageConfiguration = data;
      })

    this.action$.pipe(
      ofActionSuccessful(TransParamAdd, TransParamUpdate, TransParamDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedTransParamItem = undefined
      this.TransParamService.onFetchAllTransParamById(Number(this.messageConfiguration?.configId))
    })

    this.action$.pipe(
      ofActionCompleted(TransParamGetCommon, TransParamAdd, TransParamUpdate, TransParamDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    
    this.action$.pipe(
      ofActionCompleted(TransParamGetQuery, TransParamGetById),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false;
    })

    this.action$
      .pipe(ofActionErrored(TransParamGetQuery), takeUntil(this.destroyer$))
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
    this.TransParamService.onFetchAllTransParamById(Number(this.messageConfiguration?.configId));
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
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

    this.TransParamService.onFetchAllTransParamById(Number(this.messageConfiguration?.configId));
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
