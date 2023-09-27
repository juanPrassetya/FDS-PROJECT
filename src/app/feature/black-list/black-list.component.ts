import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DateUtils } from '../../shared/utils/date.utils';
import { BlackListState } from './state/black-list.state';
import { BlackListDomain } from './domain/black-list.domain';
import { ConfirmService } from '../../shared/services/confirm.service';
import { BlackListService } from './service/black-list.service';
import {
  BlackListAdd,
  BlackListDelete,
  BlackListGet,
  BlackListGetQuery,
  BlackListUpdate,
  BlackListUpload,
} from './state/black-list.actions';
import { AuthState } from '../../shared/auth/state/auth.state';
import { UserDomain } from '../user/domain/user.domain';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransParamDomain } from '../transaction-parameter/domain/trans-param.domain';
import { TransParamState } from '../transaction-parameter/state/trans-param.state';
import { ForkJoinHelper } from 'src/app/shared/utils/rxjs.utils';
import { TransParamGet } from '../transaction-parameter/state/trans-param.actions';

@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.css'],
})
export class BlackListComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(BlackListState.data) blackLists$!: Observable<BlackListDomain[]>;
  @Select(TransParamState.transParams) transParams$!: Observable<
    TransParamDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];

  selectedBlackListItem: BlackListDomain | undefined;

  blackListItems: Array<BlackListDomain> = [];
  entityTypes: Array<TransParamDomain> = [];
  userData!: UserDomain;

  visibleBlackListDialog: boolean = false;
  visibleBlackListDetailDialog: boolean = false;
  visibleSearchDialog: boolean = false;
  visibleActionDialog: boolean = false;
  visibleImportBlackDialog: boolean = false;

  formGroup!: FormGroup;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private blackListService: BlackListService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        { name: 'Entity Type', type: 2, field: 'entityType' },
        { name: 'Initiator', type: 1, field: 'initiator' },
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
    });
    this.authorities = this.authService.getAuthorities();
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
      if (data != undefined) {
        if (this.store$.selectSnapshot(BlackListState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.blackListService.onFetchBlackList();
        }
      } else this.isLoading = false;
    });

    this.blackLists$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.blackListItems = data;
    });

    this.transParams$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.entityTypes = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          BlackListAdd,
          BlackListUpdate,
          BlackListDelete,
          BlackListUpload
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedBlackListItem = undefined;
        this.blackListService.onFetchBlackList();
      });

    this.action$
      .pipe(
        ofActionErrored(
          BlackListAdd,
          BlackListUpdate,
          BlackListDelete,
          BlackListUpload
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(BlackListGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(BlackListGetQuery, BlackListGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

      this.action$
      .pipe(ofActionErrored(BlackListGetQuery), takeUntil(this.destroyer$))
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
    this.visibleSearchDialog = false;
    this.getDateInField()?.setValue('');
    this.getDateOutField()?.setValue('');
    this.blackListService.onFetchBlackList();
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  isValueNotValid() {
    const stat =
      this.getValueField()?.getRawValue() == '' ||
      this.getDateInField()?.hasError('required') ||
      this.getDateOutField()?.hasError('required') ||
      this.getEntityTypeField()?.hasError('required') ||
      this.getInitiatorField()?.hasError('required');
    return stat != undefined ? stat : true;
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
    if (data.entityType) {
      data.entityType = data.entityType.attribute;
    }

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (
          controlValue != null &&
          controlValue != undefined &&
          controlValue != ''
        ) {
          this.blackListService.onFetchBlackListQuery(data);
          return;
        }
      }
    }

    this.blackListService.onFetchBlackList();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedBlackListItem = undefined;
  }

  showAddtSearchFilter() {
    this.isLoading = true;
    this.blackListService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [ctx.dispatch(new TransParamGet())],
        this.destroyer$,
        () => {
          this.visibleSearchDialog = !this.visibleSearchDialog;
          this.isLoading = false;
        }
      );
    });
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleBlackListDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleBlackListDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.blackListService.onDeleteBlackList(
        Number(this.selectedBlackListItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleBlackListDialog = stat;
  }

  onDetailClicked(item: any) {
    this.selectedBlackListItem = item;
    this.visibleBlackListDetailDialog = true;
  }

  onCloseDetail(stat: boolean) {
    this.visibleBlackListDetailDialog = stat;
  }

  onClickedAction() {
    this.visibleActionDialog = true;
  }

  onClickedImport() {
    this.visibleActionDialog = false;
    this.visibleImportBlackDialog = true;
  }

  onCloseImport(stat: boolean) {
    this.visibleImportBlackDialog = stat;
  }

  getDateInField() {
    return this.formGroup.get('dateIn');
  }

  getDateOutField() {
    return this.formGroup.get('dateOut');
  }

  getValueField() {
    return this.formGroup.get('value');
  }

  getEntityTypeField() {
    return this.formGroup.get('entityType');
  }

  getInitiatorField() {
    return this.formGroup.get('initiator');
  }
}
