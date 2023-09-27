import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {AuthState} from "../../shared/auth/state/auth.state";
import {UserDomain} from "../user/domain/user.domain";
import {FraudListDomain} from "./domain/fraud-list.domain";
import {FraudListService} from "./service/fraud-list.service";
import {ConfirmService} from "../../shared/services/confirm.service";
import {FraudListState} from "./state/fraud-list.state";
import {FraudListAdd, FraudListDelete, FraudListGet, FraudListGetQuery, FraudListUpdate} from "./state/fraud-list.actions";
import {FraudListValueDomain} from "../fraud-list-value/domain/fraud-list-value.domain";
import {FraudListValueService} from "../fraud-list-value/service/fraud-list-value.service";
import {FraudListValueState} from "../fraud-list-value/state/fraud-list-value.state";
import {
  FraudListValueAdd,
  FraudListValueDelete,
  FraudListValueGetById,
  FraudListValueUpdate, FraudListValueUpload
} from "../fraud-list-value/state/fraud-list-value.actions";
import {DateUtils} from "../../shared/utils/date.utils";
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FraudListTypeDomain } from '../fraud-list-type/domain/fraud-list-type.domain';
import { FraudListTypeState } from '../fraud-list-type/state/fraud-list-type.state';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fraud-list-action',
  templateUrl: './fraud-list.component.html',
  styleUrls: ['./fraud-list.component.css']
})
export class FraudListComponent implements OnInit, OnDestroy {
  @Select(FraudListState.data) fraudList$!: Observable<FraudListDomain[]>
  @Select(FraudListValueState.items) fraudListValue$!: Observable<FraudListValueDomain[]>
  @Select(FraudListTypeState.data) fraudListTypes$!: Observable<FraudListTypeDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];

  userData!: UserDomain;
  selectedFraudListItem!: FraudListDomain | undefined
  selectedFraudListValueItem!: FraudListValueDomain | undefined
  entityTypes: Array<FraudListTypeDomain> = [];

  fraudListItems: Array<FraudListDomain> = []
  fraudValueItems: Array<FraudListValueDomain> = []

  visibleFraudListDialog: boolean = false
  visibleFraudValueDialog: boolean = false
  visibleActionDialog: boolean = false;
  visibleImportFraudValueDialog: boolean = false;

  dialogMode: string = 'ADD'
  isLoading: boolean = true;
  formGroup!: FormGroup;

  constructor(
    private store$: Store,
    private action$: Actions,
    private fraudListService: FraudListService,
    private fraudListValueService: FraudListValueService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      listName: [''],
      entityType: [''],
      userGroup: ['']
    })


    this.authorities = this.authService.getAuthorities();
    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data;
      if (data != undefined) {
        if (this.store$.selectSnapshot(FraudListState.data).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.fraudListService.onGetFraudList()
        }
      } else this.isLoading = false
    })

    this.fraudList$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.fraudListItems = data;
      })

      this.fraudListTypes$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.entityTypes = data
    })

    this.fraudListValue$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.fraudValueItems = data;
      })

    this.action$.pipe(
      ofActionSuccessful(FraudListAdd, FraudListUpdate, FraudListDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedFraudListItem = undefined
      this.fraudValueItems = []
      this.fraudListService.onGetFraudList()
    })

    this.action$.pipe(
      ofActionSuccessful(FraudListValueAdd, FraudListValueUpdate, FraudListValueDelete, FraudListValueUpload),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedFraudListValueItem = undefined
      this.fraudListValueService.onGetFraudListValueById(Number(this.selectedFraudListItem?.listId))
    })

    this.action$.pipe(
      ofActionErrored(
        FraudListAdd, FraudListUpdate, FraudListDelete,
        FraudListValueAdd, FraudListValueUpdate, FraudListValueDelete, FraudListValueUpload
      ),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(FraudListGet, FraudListValueGetById),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
    .pipe(
      ofActionCompleted(FraudListGetQuery),
      takeUntil(this.destroyer$)
    )
    .subscribe(() => {
      this.isLoading = false;
    });

    this.action$
      .pipe(ofActionErrored(FraudListGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.fraudListValueService.onResetAllInformation(
      (ctx) => {
        ctx.setState({
          ...ctx.getState(),
          items: [],
        })
      }
    )
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.fraudListService.onGetFraudList();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    data.userGroup = this.userData.userGroup?.id
    if(data.entityType) {
      data.entityType = data.entityType.typeId
    }

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.fraudListService.onGetFraudListQuery(data);
          return
        }
      }
    }

    this.fraudListService.onGetFraudList();


  }

  onListClicked(){
    this.isLoading = true
    this.selectedFraudListValueItem = undefined
    if (this.selectedFraudListItem != undefined)
      this.fraudListValueService.onGetFraudListValueById(Number(this.selectedFraudListItem.listId))
  }

  onListUnClicked() {
    this.fraudValueItems = []
    this.selectedFraudListValueItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleFraudListDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleFraudListDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.fraudListService.onDeleteFraudList(Number(this.selectedFraudListItem?.listId))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleFraudListDialog = stat
  }

  onClickedAddValueDialog() {
    this.isLoading = true
    this.dialogMode = 'ADD'
    this.visibleFraudValueDialog = true
  }

  onClickedEditValueDialog() {
    this.isLoading = true
    this.dialogMode = 'EDIT'
    this.visibleFraudValueDialog = true
  }

  onClickedDeleteValue() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.fraudListValueService.onDeleteFraudListValue(Number(this.selectedFraudListValueItem?.id))
    })
  }

  onCloseValueDialog(stat: boolean) {
    this.visibleFraudValueDialog = stat
  }

  onClickedAction() {
    this.visibleActionDialog = true;
  }

  onClickedImport() {
    this.visibleActionDialog = false
    this.visibleImportFraudValueDialog = true;
  }

  onCloseImport(stat: boolean) {
    this.visibleImportFraudValueDialog = stat
  }
}
