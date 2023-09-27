import { Component, OnDestroy, OnInit } from '@angular/core';
import { RuleDomain } from './domain/rule.domain';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { RuleState } from './state/rule.state';
import { AuthState } from '../../shared/auth/state/auth.state';
import {
  RuleActivation,
  RuleAdd,
  RuleApprove,
  RuleDeactivation,
  RuleDeleteById,
  RuleGet,
  RuleGetQuery,
  RuleHistoryGetByRuleId,
  RuleImport,
  RuleReject,
  RuleUpdate,
} from './state/rule.actions';
import { RuleService } from './services/rule.service';
import { UserDomain } from '../user/domain/user.domain';
import { ConfirmService } from '../../shared/services/confirm.service';
import { DateUtils } from '../../shared/utils/date.utils';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RuleHistoryDomain } from './domain/rule-history.domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css'],
})
export class RuleComponent implements OnInit, OnDestroy {
  @Select(RuleState.rules) rules$!: Observable<RuleDomain[]>;
  @Select(RuleState.ruleHistoryByRuleId) rulesHistory$!: Observable<
    RuleHistoryDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup;

  items: Array<RuleDomain> = [];
  selectedItem: RuleDomain | undefined;
  userData!: UserDomain;
  ruleHistory: Array<RuleHistoryDomain> = [];
  visibleRuleDetailDialog: boolean = false;
  visibleActionDialog: boolean = false;
  visibleSetStatusDialog: boolean = false;
  visibleApprovalDialog: boolean = false;
  visibleImportRuleDialog: boolean = false;
  visibleExportRuleDialog: boolean = false;
  visibleSearchDialog: boolean = false;
  disabledButton: boolean = true;

  isLoading: boolean = true;
  ruleStatus: any[] = [
    {
      stat: 'Active',
    },
    {
      stat: 'Not Active',
    },
  ];

  constructor(
    private store$: Store,
    private action$: Actions,
    private ruleService: RuleService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        { name: 'Risk Value', type: 1, field: 'riskValue' },
        { name: 'Priority', type: 1, field: 'priority' },
        { name: 'Author', type: 1, field: 'author' },
      ],
    ],
    [
      1,
      [
        { name: 'isActive', type: 2, field: 'isActive' },
        { name: 'Status', type: 3, field: 'status' },
        {},
      ],
    ],
  ]);

  isActive = [
    { name: 'Yes', code: true },
    { name: 'No', code: false },
  ];

  status = [
    { name: 'Approved' },
    { name: 'Declined' },
    { name: 'Just Update' },
    { name: 'Just Create' },
    { name: 'Waiting Confirmation' },
  ];

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      ruleName: [''],
      isActive: [''],
      riskValue: [''],
      priority: [''],
      author: [''],
      status: [''], //Approved, Declined, Just Update, Just Create, Waiting Confirmation
      userGroup: [''], //id user group yang sedang login
    });
    this.authorities = this.authService.getAuthorities();
    this.rules$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.rulesHistory$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.ruleHistory = data;
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
      if (data != undefined) {
        if (this.store$.selectSnapshot(RuleState.rules).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.ruleService.onFetchAllRule(Number(this.userData.userGroup?.id));
        }
      } else {
        this.isLoading = false;
      }
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          RuleAdd,
          RuleUpdate,
          RuleDeleteById,
          RuleActivation,
          RuleDeactivation,
          RuleApprove,
          RuleReject,
          RuleImport
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.ruleService.onFetchAllRule(Number(this.userData.userGroup?.id));
      });

    this.action$
      .pipe(
        ofActionErrored(
          RuleAdd,
          RuleUpdate,
          RuleDeleteById,
          RuleActivation,
          RuleDeactivation,
          RuleApprove,
          RuleReject,
          RuleImport
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(ofActionCompleted(RuleGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        if (this.selectedItem != undefined) {
          this.selectedItem = this.items.find(
            (v1) => v1.ruleId == this.selectedItem?.ruleId
          );
        }
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(RuleHistoryGetByRuleId),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.visibleRuleDetailDialog = true;
      });

    this.action$
      .pipe(ofActionCompleted(RuleGetQuery, RuleGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

      this.action$
      .pipe(ofActionErrored(RuleGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onDetailClicked(data: RuleDomain) {
    this.isLoading = true;
    this.selectedItem = data;
    this.ruleService.onFetchRuleHistoryByRuleId(Number(data.ruleId));
  }

  onCloseRuleDetailDialog(stat: boolean) {
    this.visibleRuleDetailDialog = stat;
  }

  onDeleteCondition() {
    if (this.selectedItem != undefined) {
      this.confirmService.showDialogConfirm(() => {
        this.isLoading = true;
        this.ruleService.onDeleteRule(Number(this.selectedItem?.ruleId));
      });
    }
  }

  editRouterLinkChecker() {
    return 'edit/' + this.selectedItem?.ruleId;
  }

  onClickedAction() {
    this.visibleActionDialog = true;
  }

  onClickedSetStatus() {
    if (this.selectedItem != undefined) {
      this.visibleActionDialog = false;
      this.visibleSetStatusDialog = true;
    }
  }

  onCloseSetStatus(stat: boolean) {
    this.visibleSetStatusDialog = stat;
  }

  onClickedApproval() {
    if (this.selectedItem != undefined) {
      this.visibleActionDialog = false;
      this.visibleApprovalDialog = true;
    }
  }

  onCloseApproval(stat: boolean) {
    this.visibleApprovalDialog = stat;
  }

  onClickedImportRule() {
    this.visibleActionDialog = false;
    this.visibleImportRuleDialog = true;
  }

  onClickedExportRule() {
    this.visibleActionDialog = false;
    this.visibleExportRuleDialog = true;
  }

  onCloseImportRule(stat: boolean) {
    this.visibleImportRuleDialog = stat;
  }

  onCloseExportRule(stat: boolean) {
    this.visibleExportRuleDialog = stat;
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }

  isValueNotValid(): boolean {
    const stat =
      this.getRulesNamefield()?.hasError('required') ||
      this.getDateFromField()?.hasError('required') ||
      this.getDateToFromField()?.hasError('required') ||
      this.getRiskValueField()?.hasError('required') ||
      this.getPriorityField()?.hasError('required') ||
      this.getAuthorField()?.hasError('required') ||
      this.getIsActiveField()?.hasError('required') ||
      this.getStatusField()?.hasError('required');
    return stat != undefined ? stat : true;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.ruleService.onFetchAllRule(Number(this.userData.userGroup?.id));
    this.visibleSearchDialog = false;
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const dateFromField = this.getDateFromField();
    const dateToField = this.getDateToFromField();
    if (data.dateFrom != '') {
      data.dateFrom = DateUtils.ConvertToTimestampFormatV3(data.dateFrom);
    }
    if (data.dateTo != '') {
      data.dateTo = DateUtils.ConvertToTimestampFormatV3(data.dateTo);
    }
    if(data.status) {
      data.status = data.status.name;
    }
    if(data.isActive) {
      data.isActive = data.isActive.code;
    }
    data.userGroup = this.userData.userGroup?.id;
    data.dateFrom = dateFromField?.value !== null ? data.dateFrom : '';
    data.dateTo = dateToField?.value !== null ? data.dateTo : '';

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (
          controlValue != null &&
          controlValue != undefined &&
          controlValue != ''
        ) {
          this.ruleService.onFetchAllRuleQuery(data);
          return;
        }
      }
    }

    this.ruleService.onFetchAllRule(Number(this.userData.userGroup?.id));
  }

  showAddtSearchFilter() {
    this.visibleSearchDialog = !this.visibleSearchDialog;
  }

  charReplacement(value: string) {
    if (value != undefined) {
      return value.replace('_', ' ');
    }
    return value;
  }

  isApprovalDisabled() {
    if (
      this.selectedItem == undefined ||
      !StringUtils.findOperations(this.authorities, 'RULE_MAKER')
    ) {
      return true;
    }

    return (
      this.selectedItem?.status == 'Approved' ||
      this.selectedItem?.status == 'Rejected' ||
      !this.StringUtils.findOperations(this.authorities, 'RULE_MAKER')
    );
  }

  isSetStatusDisabled() {
    return (
      this.selectedItem == undefined ||
      StringUtils.findOperations(this.authorities, 'RULE_CHECKER')
    );
  }

  getRulesNamefield() {
    return this.formGroup.get('ruleName');
  }

  getDateFromField() {
    return this.formGroup.get('dateFrom');
  }

  getDateToFromField() {
    return this.formGroup.get('dateTo');
  }

  getRiskValueField() {
    return this.formGroup.get('riskValue');
  }

  getPriorityField() {
    return this.formGroup.get('priority');
  }

  getAuthorField() {
    return this.formGroup.get('author');
  }

  getIsActiveField() {
    return this.formGroup.get('isActive');
  }

  getStatusField() {
    return this.formGroup.get('status');
  }
}

// gridContainer: any;
// itemsPerRow: number = 0;

// ngAfterViewChecked() {
//   this.gridContainer = this.elRef.nativeElement.querySelector('.p-grid');
//   this.itemsPerRow = Math.floor(this.gridContainer.offsetWidth / this.elRef.nativeElement.querySelector('.rule-group-item-container').offsetWidth);
//   this.updateGridStyles();
// }
//
// updateGridStyles() {
//   const gridItems = this.gridContainer.querySelectorAll('.rule-group-item-container');
//
//   gridItems.forEach((item: any, index: any) => {
//     const row = Math.floor(index / this.itemsPerRow);
//     const col = index % this.itemsPerRow;
//
//     const itemContainer = item.querySelector(".rule-group-ins-container");
//
//     if (row === 0 && col !== 0) {
//       const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//       itemContainer.className = test.join(" ").trim();
//       itemContainer.classList.add('row-0-col-any')
//     }
//
//     if (row === 0 && col === 0) {
//       const rowItems = Array.from(gridItems).slice(row * this.itemsPerRow, (row + 1) * this.itemsPerRow);
//       if (rowItems.indexOf(item) === 0) {
//         const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//         itemContainer.className = test.join(" ").trim();
//         itemContainer.classList.add('row-0-col-0');
//       }
//     }
//
//     if (col === 0 && row !== (Math.floor(gridItems.length / this.itemsPerRow) - 1)) {
//       const rowItems = Array.from(gridItems).slice(row * this.itemsPerRow, (row + 1) * this.itemsPerRow);
//       if (rowItems.indexOf(item) === 0) {
//         const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//         itemContainer.className = test.join(" ").trim();
//         itemContainer.classList.add('row-any-col-0');
//       }
//     }
//
//     if (
//       //Ke trigger ketika row terakhir, datanya full
//       (col === 0 && row === (Math.floor(gridItems.length / this.itemsPerRow) - 1)) ||
//
//       //Ke trigger ketika row terakhir, datanya ga full
//       (col === 0 && row === (Math.floor(gridItems.length / this.itemsPerRow)))
//     ) {
//       const rowItems = Array.from(gridItems).slice(row * this.itemsPerRow, (row + 1) * this.itemsPerRow);
//       if (rowItems.indexOf(item) === 0) {
//         const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//         itemContainer.className = test.join(" ").trim();
//         itemContainer.classList.add('row-last-col-0');
//       }
//     }
//
//     if (row === (Math.floor(gridItems.length / this.itemsPerRow) - 1) && col !== this.itemsPerRow && col !== 0) {
//       const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//       itemContainer.className = test.join(" ").trim();
//       itemContainer.classList.add('row-last-col-any');
//     }
//
//     console.log("row: " + row + " col: " + col + " " + Math.floor(gridItems.length / this.itemsPerRow) + " " + (row === Math.floor(gridItems.length / this.itemsPerRow)))
//
//     if (row === (Math.floor(gridItems.length / this.itemsPerRow) - 1) && col === this.itemsPerRow - 1) {
//       const rowItems = Array.from(gridItems).slice(row * this.itemsPerRow, (row + 1) * this.itemsPerRow);
//       if (rowItems.indexOf(item) === this.itemsPerRow - 1) {
//         const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//         itemContainer.className = test.join(" ").trim();
//         itemContainer.classList.add('row-last-col-last')
//       }
//     }
//
//     if (col === this.itemsPerRow - 1 && row !== (Math.floor(gridItems.length / this.itemsPerRow) - 1)) {
//       const rowItems = Array.from(gridItems).slice(row * this.itemsPerRow, (row + 1) * this.itemsPerRow);
//       if (rowItems.indexOf(item) === this.itemsPerRow - 1) {
//         const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//         itemContainer.className = test.join(" ").trim();
//         itemContainer.classList.add('row-any-col-last')
//       }
//     }
//
//
//     if (col === this.itemsPerRow - 1 && row === 0) {
//       const rowItems = Array.from(gridItems).slice(row * this.itemsPerRow, (row + 1) * this.itemsPerRow);
//       if (rowItems.indexOf(item) === this.itemsPerRow - 1) {
//         const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//         itemContainer.className = test.join(" ").trim();
//         itemContainer.classList.add('row-0-col-last')
//       }
//     }
//
//     // if (row === Math.floor(gridItems.length / this.itemsPerRow) && col === 0) {
//     //   const test = itemContainer.className.split(" ").filter((c: string) => !c.startsWith("row"));
//     //   itemContainer.className = test.join(" ").trim();
//     //   itemContainer.classList.add('row-last-col-0');
//     // }
//   });
// }
//
// @HostListener('window:resize', ['$event'])
// sizeChange(event: any) {
//   this.gridContainer = this.elRef.nativeElement.querySelector('.p-grid');
//   this.itemsPerRow = Math.floor(this.gridContainer.offsetWidth / this.elRef.nativeElement.querySelector('.rule-group-item-container').offsetWidth);
//   this.updateGridStyles();
// }
