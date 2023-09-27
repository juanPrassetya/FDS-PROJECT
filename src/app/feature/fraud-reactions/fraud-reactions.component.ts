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
import { FraudReactionsState } from './state/fraud-reactions.state';
import { FraudReactionsDomain } from './domain/fraud-reactions.domain';
import { ConfirmService } from '../../shared/services/confirm.service';
import { FraudReactionsService } from './service/fraud-reactions.service';
import {
  FraudReactionsAdd,
  FraudReactionsDelete,
  FraudReactionsGet,
  FraudReactionsGetQuery,
  FraudReactionsUpdate,
} from './state/fraud-reactions.actions';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fraud-reactions',
  templateUrl: './fraud-reactions.component.html',
  styleUrls: ['./fraud-reactions.component.css'],
})
export class FraudReactionsComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(FraudReactionsState.data) fraudReactions$!: Observable<
    FraudReactionsDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedFraudReactionsItem: FraudReactionsDomain | undefined;

  fraudReactionsItems: Array<FraudReactionsDomain> = [];

  visibleFraudReactionsDetailDialog: boolean = false;
  visibleBindingTypeDialog: boolean = false;
  visibleRuleDialog: boolean = false;
  visibleRuleGroupDialog: boolean = false;
  visibleWhiteDialog: boolean = false;
  visibleBlackDialog: boolean = false;
  visibleSearchDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private fraudReactionsService: FraudReactionsService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        { name: 'Zone', type: 3, field: 'zone' },
        { name: 'Action', type: 2, field: 'action' },
        { name: 'Action Value', type: 1, field: 'actionValue' },
      ],
    ],
  ]);
  dummyBindingType = [
    { name: 'RULE' },
    { name: 'BLACKLIST' },
    { name: 'GROUP' },
    { name: 'WHITELIST' },
  ];

  ngOnInit() {
    this.formGroup = this.fb.group({
      bindingId: [''],
      bindingType: [''],
      priority: [''],
      zone: [''],
      action: [''],
      actionValue: [''],
    });
    this.authorities = this.authService.getAuthorities();
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(FraudReactionsState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.fraudReactionsService.onGetFraudReactions();
        }
      } else this.isLoading = false;
    });

    this.fraudReactions$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.fraudReactionsItems = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          FraudReactionsAdd,
          FraudReactionsUpdate,
          FraudReactionsDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedFraudReactionsItem = undefined;
        this.fraudReactionsService.onGetFraudReactions();
      });

    this.action$
      .pipe(ofActionErrored(FraudReactionsDelete), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(FraudReactionsGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(FraudReactionsGetQuery, FraudReactionsGet),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

      this.action$
      .pipe(ofActionErrored(FraudReactionsGetQuery), takeUntil(this.destroyer$))
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

  onSearchClicked(data: any) {
    this.isLoading = true;
    if(data.action) {
      data.action = data.action.name;
    }
    if(data.zone) {
      data.zone = data.zone.name;
    }
    if(data.bindingType) {
      data.bindingType = data.bindingType.name;
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
          this.fraudReactionsService.onGetFraudReactionsByQuery(data);
          return;
        }
      }
    }

    this.fraudReactionsService.onGetFraudReactions();
  }

  onReactClicked() {}

  onReactUnClicked() {
    this.selectedFraudReactionsItem = undefined;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.fraudReactionsService.onGetFraudReactions();
    this.visibleSearchDialog = false;
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  isValueNotValid() {
    const stat =
      this.getBindingIdField()?.getRawValue() == '' ||
      this.getBindingTypeField()?.hasError('required') ||
      this.getPriorityField()?.hasError('required') ||
      this.getZoneField()?.hasError('required') ||
      this.getActionField()?.hasError('required') ||
      this.getActionValue()?.hasError('required');
    return stat != undefined ? stat : true;
  }

  showAddtSearchFilter() {
    this.visibleSearchDialog = !this.visibleSearchDialog;
  }

  onClickedAddReactDialog() {
    this.dialogMode = 'ADD';
    this.visibleBindingTypeDialog = true;
  }

  onClickedRule() {
    this.visibleBindingTypeDialog = false;
    this.visibleRuleDialog = true;
  }

  onCloseRuleDialog(stat: boolean) {
    this.visibleRuleDialog = stat;
  }

  onClickedRuleGroup() {
    this.visibleBindingTypeDialog = false;
    this.visibleRuleGroupDialog = true;
  }

  onCloseRuleGroupDialog(stat: boolean) {
    this.visibleRuleGroupDialog = stat;
  }

  onClickedWhite() {
    this.visibleBindingTypeDialog = false;
    this.visibleWhiteDialog = true;
  }

  onCloseWhiteDialog(stat: boolean) {
    this.visibleWhiteDialog = stat;
  }

  onClickedBlack() {
    this.visibleBindingTypeDialog = false;
    this.visibleBlackDialog = true;
  }

  onCloseBlackDialog(stat: boolean) {
    this.visibleBlackDialog = stat;
  }

  onClickedEditReactDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;

    if (this.selectedFraudReactionsItem != undefined) {
      switch (this.selectedFraudReactionsItem.bindingType) {
        case 'RULE':
          this.visibleRuleDialog = true;
          break;

        case 'GROUP':
          this.visibleRuleGroupDialog = true;
          break;

        case 'WHITELIST':
          this.visibleWhiteDialog = true;
          break;

        case 'BLACKLIST':
          this.visibleBlackDialog = true;
          break;
      }
    }
  }

  onClickedDeleteReact() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.fraudReactionsService.onDeleteFraudReactions(
        Number(this.selectedFraudReactionsItem?.id)
      );
    });
  }

  onDetailClicked(item: any) {
    this.selectedFraudReactionsItem = item;
    this.visibleFraudReactionsDetailDialog = true;
  }

  onCloseDetail(stat: boolean) {
    this.visibleFraudReactionsDetailDialog = stat;
  }

  actionValueMapping(item: any) {
    if (item.action == 'EMAIL_NOTIFICATION') {
      return JSON.parse(item.actionValue).recipientType;
    }

    return item.actionValue;
  }

  charReplacement(value: string) {
    if (value != undefined) {
      return value.replace('_', ' ');
    }
    return value;
  }

  getBindingIdField() {
    return this.formGroup.get('bindingId');
  }

  getBindingTypeField() {
    return this.formGroup.get('bindingType');
  }

  getPriorityField() {
    return this.formGroup.get('priority');
  }

  getZoneField() {
    return this.formGroup.get('zone');
  }

  getActionField() {
    return this.formGroup.get('action');
  }

  getActionValue() {
    return this.formGroup.get('actionValue');
  }
}
