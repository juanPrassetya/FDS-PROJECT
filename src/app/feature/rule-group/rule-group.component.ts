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
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from '../user/domain/user.domain';
import { RuleGroupDomain } from './domain/rule-group.domain';
import { RuleGroupState } from './state/rule-group.state';
import { RuleGroupService } from './service/rule-group.service';
import {
  RuleGroupAdd,
  RuleGroupDelete,
  RuleGroupGet,
  RuleGroupGetQuery,
  RuleGroupUpdate,
} from './state/rule-group.actions';
import { RuleDomain } from '../rule/domain/rule.domain';
import { RuleState } from '../rule/state/rule.state';
import { ConfirmService } from '../../shared/services/confirm.service';
import { FraudReactionsState } from '../fraud-reactions/state/fraud-reactions.state';
import { FraudReactionsDomain } from '../fraud-reactions/domain/fraud-reactions.domain';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  FraudReactionsAdd,
  FraudReactionsDelete,
  FraudReactionsGetByBindingIdAndType,
  FraudReactionsResetState,
  FraudReactionsUpdate,
} from '../fraud-reactions/state/fraud-reactions.actions';
import { ResetRuleById, RuleGetByGroupId } from '../rule/state/rule.actions';
import { ForkJoinHelper } from '../../shared/utils/rxjs.utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rule-group',
  templateUrl: './rule-group.component.html',
  styleUrls: ['./rule-group.component.css'],
})
export class RuleGroupComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(RuleGroupState.data) ruleGroups$!: Observable<RuleGroupDomain[]>;
  @Select(RuleState.ruleByGroupId) rules$!: Observable<RuleDomain[]>;
  @Select(FraudReactionsState.dataByBinding) reactionByBinding$!: Observable<
    FraudReactionsDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];

  userData!: UserDomain;
  ruleGroups: Array<RuleGroupDomain> = [];
  rules: Array<RuleDomain> = [];
  reactionByBinding: Array<FraudReactionsDomain> = [];
  formGroup!: FormGroup;

  selectedRuleGroup: RuleGroupDomain | undefined;

  visibleRuleGroupDetailDialog = false;
  visibleRuleGroupDialog = false;
  visibleSearchDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private ruleGroupService: RuleGroupService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        { name: 'Priority', type: 1, field: 'priority' },
        { name: 'Is Active', type: 2, field: 'isActive' },
        { name: 'Is Forced Reactions', type: 3, field: 'isForcedReaction' },
      ],
    ],
  ]);

  isActive = [
    {
      name: 'Active',
      code: true,
    },
    {
      name: 'Not Active',
      code: false,
    },
  ];


  isForcedReaction = [
    {
      name: 'Yes',
      code: true
    },
    {
      name: 'No',
      code: false
    }
  ]


  ngOnInit() {
    this.formGroup = this.fb.group({
      groupName: [''],
      threshouldBlack: [''],
      threshouldGrey: [''],
      priority: [''],
      isActive: [''],
      isForcedReaction: [''],
      userGroup: [''],
    });
    this.authorities = this.authService.getAuthorities();
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
      if (data != undefined) {
        if (this.store$.selectSnapshot(RuleGroupState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.ruleGroupService.onGetRuleGroup(Number(data.userGroup?.id));
        }
      } else {
        this.isLoading = false;
      }
    });

    this.ruleGroups$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.ruleGroups = data;
    });

    this.rules$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.rules = data;
    });

    this.reactionByBinding$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.reactionByBinding = data;
      });

    this.action$
      .pipe(
        ofActionSuccessful(RuleGroupAdd, RuleGroupUpdate, RuleGroupDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;

        this.resetAllValue();
        this.ruleGroupService.onGetRuleGroup(Number(this.userData.userGroup?.id));
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

        if (this.selectedRuleGroup != undefined) {
          const rgId = Number(this.selectedRuleGroup.id);
          this.getAllInformation(rgId);
        }
      });

    this.action$
      .pipe(
        ofActionErrored(
          RuleGroupAdd,
          RuleGroupDelete,
          RuleGroupDelete,
          FraudReactionsAdd,
          FraudReactionsUpdate,
          FraudReactionsDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(RuleGroupGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(
        ofActionCompleted(RuleGroupGetQuery, RuleGroupGet),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

      this.action$
      .pipe(ofActionErrored(RuleGroupGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.ruleGroupService.onResetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(new ResetRuleById()),
          ctx.dispatch(
            new FraudReactionsResetState((ctx) => {
              ctx.setState({
                ...ctx.getState(),
                dataByBinding: [],
              });
            })
          ),
        ],
        this.destroyer$,
        () => {
          this.destroyer$.next(true);
          this.destroyer$.complete();
        }
      );
    });
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.ruleGroupService.onGetRuleGroup(Number(this.userData.userGroup?.id));
    this.visibleSearchDialog = false;
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  isValueNotValid() {
    const stat = this.getGroupNameField()?.getRawValue() == '' || this.getThresholdBlackField()?.hasError('required') ||
      this.getThresholdGreyField()?.hasError('required') || this.getPriorityField()?.hasError('required') ||
      this.getIsActiveField()?.hasError('required') || this.getIsForcedReactionField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    data.userGroup = this.userData.userGroup?.id;
    if(data.isActive) {
      data.isActive = data.isActive.code;
    }
    if(data.isForcedReaction) {
      data.isForcedReaction = data.isForcedReaction.code
    }

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.ruleGroupService.onGetRuleGroupQuery(data);
          return
        }
      }
    }

    this.ruleGroupService.onGetRuleGroup(Number(this.userData.userGroup?.id));
  }

  showAddtSearchFilter() {
    this.visibleSearchDialog = !this.visibleSearchDialog;
  }

  onRuleGroupClicked() {
    this.isLoading = true;

    if (this.selectedRuleGroup != undefined) {
      this.getAllInformation(Number(this.selectedRuleGroup.id));
    }
  }

  onRuleGroupUnClicked() {
    this.resetAllValue();
  }

  onClickedAddRuleGroupDialog() {
    this.dialogMode = 'ADD';
    this.isLoading = true;
    this.visibleRuleGroupDialog = true;
  }

  onClickedEditRuleGroupDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleRuleGroupDialog = true;
  }

  onClickedDeleteRuleGroupDialog() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.ruleGroupService.onDeleteRuleGroup(
        Number(this.selectedRuleGroup?.id)
      );
    });
  }

  onCloseRuleGroupDialog(stat: boolean) {
    this.visibleRuleGroupDialog = stat;
  }

  onRuleGroupDetailClicked(item: any) {
    if (this.selectedRuleGroup != undefined) {
      if (item.id != this.selectedRuleGroup.id) {
        this.isLoading = true;
        this.getAllInformation(Number(item.id));
      }
    }

    this.selectedRuleGroup = item;
    this.visibleRuleGroupDetailDialog = true;
  }

  onCloseRuleGroupDetail(stat: boolean) {
    this.visibleRuleGroupDetailDialog = stat;
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }

  getAllInformation(rgId: number) {
    this.ruleGroupService.onGetAllInformation((ctx) => {
      forkJoin([
        ctx.dispatch(new RuleGetByGroupId(rgId)),
        ctx.dispatch(new FraudReactionsGetByBindingIdAndType(rgId, 'GROUP')),
      ]).subscribe(() => {
        this.isLoading = false;
      });
    });
  }

  resetAllValue() {
    this.rules = [];
    this.reactionByBinding = [];
    this.selectedRuleGroup = undefined;
  }

  getGroupNameField() {
    return this.formGroup.get('groupName')
  }

  getThresholdBlackField() {
    return this.formGroup.get('threshouldBlack')
  }

  getThresholdGreyField() {
    return this.formGroup.get('threshouldGrey');
  }

  getPriorityField() {
    return this.formGroup.get('priority');
  }

  getIsActiveField() {
    return this.formGroup.get('isActive')
  }

  getIsForcedReactionField() {
    return this.formGroup.get('isForcedReaction')
  }
}
