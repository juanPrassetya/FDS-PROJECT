import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {DateUtils} from "../../shared/utils/date.utils";
import {WhiteListDomain} from "./domain/white-list.domain";
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {UserDomain} from "../user/domain/user.domain";
import {UserGroupState} from "../user-group/state/user-group.state";
import {UserGroupDomain} from "../user-group/domain/user-group.domain";
import {TransParamState} from "../transaction-parameter/state/trans-param.state";
import {TransParamDomain} from "../transaction-parameter/domain/trans-param.domain";
import {ConfirmService} from "../../shared/services/confirm.service";
import {WhiteListState} from "./state/white-list.state";
import {WhiteListService} from "./service/white-list.service";
import {
  WhiteListAdd,
  WhiteListDelete,
  WhiteListGet,
  WhiteListGetQuery,
  WhiteListUpdate,
  WhiteListUpload
} from "./state/white-list.actions";
import { AuthService } from 'src/app/shared/services/auth.service';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FraudListTypeService } from '../fraud-list-type/service/fraud-list-type.service';
import { ForkJoinHelper } from 'src/app/shared/utils/rxjs.utils';
import { TransParamGet } from '../transaction-parameter/state/trans-param.actions';

@Component({
  selector: 'app-white-list',
  templateUrl: './white-list.component.html',
  styleUrls: ['./white-list.component.css']
})
export class WhiteListComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(UserGroupState.userGroups) userGroups$!: Observable<UserGroupDomain[]>
  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(WhiteListState.data) whiteLists$!: Observable<WhiteListDomain[]>

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];

  selectedWhiteListItem!: WhiteListDomain | undefined

  whiteListItems: Array<WhiteListDomain> = []
  entityTypes: Array<TransParamDomain> = [];
  userData!: UserDomain;

  formGroup!: FormGroup;


  visibleWhiteListDialog: boolean = false
  visibleWhiteListDetailDialog: boolean = false
  visibleSearchDialog: boolean = false;
  visibleActionDialog: boolean = false;
  visibleImportWhiteDialog: boolean = false;

  dialogMode: string = 'ADD'
  isLoading: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
    private whiteListService: WhiteListService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder,
    private fraudListTypeService: FraudListTypeService
  ) {
  }

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        {name: 'Entity Type', type: 2, field: 'entityType'},
        {name: 'Initiator', type: 1, field: 'initiator'},
        {},
      ],
    ],
  ]);

  ngOnInit() {
    this.formGroup = this.fb.group({
      dateIn: [''],
      dateOut: [''],
      userGroup: [''],
      entityType: [''],
      initiator: [''],
      value: [''],
    })
     this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data;
      if (data != undefined) {
        if (this.store$.selectSnapshot(WhiteListState.data).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.whiteListService.onFetchWhiteList()
        }
      } else this.isLoading = false
    })

    this.whiteLists$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.whiteListItems = data;
      })

      this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        this.entityTypes = data;
      })

    this.action$.pipe(
      ofActionSuccessful(WhiteListAdd, WhiteListUpdate, WhiteListDelete, WhiteListUpload),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedWhiteListItem = undefined
      this.whiteListService.onFetchWhiteList()
    })

    this.action$.pipe(
      ofActionErrored(WhiteListAdd, WhiteListUpdate, WhiteListDelete, WhiteListUpload),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(WhiteListGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
      .pipe(
        ofActionCompleted(WhiteListGetQuery, WhiteListGet),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

      this.action$
      .pipe(ofActionErrored(WhiteListGetQuery), takeUntil(this.destroyer$))
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
    this.visibleSearchDialog = false;
    this.getDateInField()?.setValue('');
    this.getDateOutField()?.setValue('')
    this.whiteListService.onFetchWhiteList();
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  isValueNotValid() {
    const stat = this.getValueField()?.hasError('required') || this.getDateInField()?.hasError('required') ||
      this.getDateOutField()?.hasError('required') || this.getEntityTypeField()?.hasError('required') ||
      this.getInitiatorField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const dateInField = this.getDateInField();
    const dateOutField = this.getDateOutField();

    if (data.dateOut != '') {
      data.dateOut = DateUtils.ConvertToTimestampFormatV3(data.dateOut);
    }
    if (data.dateIn != '') {
      data.dateIn = DateUtils.ConvertToTimestampFormatV3(data.dateIn);
    }
    data.dateIn = dateInField?.value !== null ? data.dateIn : '';
    data.dateOut = dateOutField?.value !== null ? data.dateOut : '';
    data.userGroup = this.userData.userGroup?.id;
    if(data.entityType) {
      data.entityType = data.entityType.attribute
    }

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.whiteListService.onFetchWhiteListQuery(data);
          return
        }
      }
    }

    this.whiteListService.onFetchWhiteList();
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedWhiteListItem = undefined
  }

  showAddtSearchFilter() {
    this.isLoading = true;
    this.whiteListService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(new TransParamGet())
        ],
        this.destroyer$,
        () => {
          this.visibleSearchDialog = !this.visibleSearchDialog;
          this.isLoading = false;
        }
      )
    })
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleWhiteListDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.visibleWhiteListDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.whiteListService.onDeleteWhiteList(Number(this.selectedWhiteListItem?.id))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleWhiteListDialog = stat
  }

  onDetailClicked(item: any) {
    this.selectedWhiteListItem = item
    this.visibleWhiteListDetailDialog = true
  }

  onCloseDetail(stat: boolean) {
    this.visibleWhiteListDetailDialog = stat
  }

  onClickedAction() {
    this.visibleActionDialog = true;
  }

  onClickedImport() {
    this.visibleActionDialog = false
    this.visibleImportWhiteDialog = true;
  }

  onCloseImport(stat: boolean) {
    this.visibleImportWhiteDialog = stat
  }

  getDateInField() {
    return this.formGroup.get('dateIn')
  }

  getDateOutField() {
    return this.formGroup.get('dateOut');
  }

  getValueField() {
    return this.formGroup.get('value')
  }

  getEntityTypeField() {
    return this.formGroup.get('entityType')
  }

  getInitiatorField() {
    return this.formGroup.get('initiator')
  }
}
