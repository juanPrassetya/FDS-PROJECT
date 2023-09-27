import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from '@ngxs/store';
import {Observable, Subject, takeUntil} from 'rxjs';
import {MessageConfigurationDomain} from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import {TransParamDomain} from 'src/app/feature/transaction-parameter/domain/trans-param.domain';
import {TransParamService} from 'src/app/feature/transaction-parameter/service/trans-param.service';
import {
  TransParamAdd,
  TransParamDelete, TransParamGet, TransParamGetByEndpoint,
  TransParamGetCommon,
  TransParamGetQuery,
  TransParamUpdate
} from 'src/app/feature/transaction-parameter/state/trans-param.actions';
import {TransParamState} from 'src/app/feature/transaction-parameter/state/trans-param.state';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {AuthService} from 'src/app/shared/services/auth.service';
import {ConfirmService} from 'src/app/shared/services/confirm.service';
import {DateUtils} from 'src/app/shared/utils/date.utils';
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {ExtIntJSONState} from '../../state/ext-int-json.state';
import {ExtIntJSONService} from '../../service/ext-int-json.service';
import {JsonEndpointDomain} from '../../domain/json-endpoint.domain';

@Component({
  selector: 'app-json-transaction-param',
  templateUrl: './json-transaction-param.component.html',
  styleUrls: ['./json-transaction-param.component.css']
})
export class JsonTransactionParamComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(TransParamState.transParams) TransParams$!: Observable<TransParamDomain[]>
  @Select(ExtIntJSONState.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;
  @Select(ExtIntJSONState.endpoints)
  endpoints$!: Observable<[]>;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];
  formGroup!: FormGroup
  userData!: UserDomain

  endpointItems: Array<JsonEndpointDomain> = [];
  selectedEndpointItem!: JsonEndpointDomain | undefined;

  selectedTransParamItem!: TransParamDomain | undefined
  messageConfiguration: MessageConfigurationDomain | undefined

  TransParamItems: Array<TransParamDomain> = []

  visibleTransParamDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
    private TransParamService: TransParamService,
    private confirmService: ConfirmService,
    private jsonService: ExtIntJSONService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      attribute: [''],
      fieldTag: [''],
      endpoint: [''],
      type: [''],
      length: [''],
      description: ['']
    })

    this.authorities = this.authService.getAuthorities();

    this.endpoints$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.endpointItems = data;
      })

    this.TransParams$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
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
      this.TransParamService.onFetchTransParamByEndpoint(Number(this.selectedEndpointItem?.endpointId))
    })

    this.action$.pipe(
      ofActionCompleted(TransParamGetByEndpoint, TransParamAdd, TransParamUpdate, TransParamDelete),
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
    this.TransParamService.onFetchTransParamByEndpoint(Number(this.selectedEndpointItem?.endpointId))
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    data.configId = this.messageConfiguration?.configId;
    data.endpointId = this.selectedEndpointItem?.endpointId

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != '') {
          this.TransParamService.onFetchTransParamQuery(data);
          return
        }
      }
    }

    this.TransParamService.onFetchTransParamByEndpoint(Number(this.selectedEndpointItem?.endpointId))
  }

  onListClicked(data: any) {
    this.isLoading = true
    this.selectedTransParamItem = undefined
    if (this.selectedEndpointItem != undefined)
      this.TransParamService.onFetchTransParamByEndpoint(Number(this.selectedEndpointItem?.endpointId))
  }

  onListUnClicked() {
    this.TransParamItems = []
    this.selectedTransParamItem = undefined
  }

  disabledButton() {
    if(this.selectedTransParamItem != undefined) {
      return !this.selectedTransParamItem.addtData
    }
    return this.selectedTransParamItem == undefined;
  }

  onListTransParamClicked() {

  }

  onListTransParamUnClicked() {
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
