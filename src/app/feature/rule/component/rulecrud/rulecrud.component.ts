import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {RuleGroupService} from "../../../rule-group/service/rule-group.service";
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select} from "@ngxs/store";
import {catchError, forkJoin, Observable, of, Subject, takeUntil} from "rxjs";
import {RuleGroupState} from "../../../rule-group/state/rule-group.state";
import {RuleGroupDomain} from "../../../rule-group/domain/rule-group.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {RuleAdd, RuleGetById, RuleUpdate} from "../../state/rule.actions";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {RuleService} from "../../services/rule.service";
import {RuleGroupGet} from "../../../rule-group/state/rule-group.actions";
import {RuleBodyDomain} from "../../domain/rule-body.domain";
import {maxThreeDigitsValidator, StringUtils} from "../../../../shared/utils/string.utils";
import {ConfirmService} from "../../../../shared/services/confirm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutePathEnum} from "../../../../shared/enum/route-path.enum";
import {RuleState} from "../../state/rule.state";
import {RuleDomain} from "../../domain/rule.domain";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";

@Component({
  selector: 'app-rulecrud',
  templateUrl: './rulecrud.component.html',
  styleUrls: ['./rulecrud.component.css']
})
export class RulecrudComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(RuleGroupState.data) ruleGroups$!: Observable<RuleGroupDomain[]>
  @Select(RuleState.rule) rule$!: Observable<RuleDomain>

  dummyRuleGroups = [
    {value: 'Standard', code: 1},
  ];

  ruleStatus = [
    {value: 'Not Active', code: false},
    {value: 'Active', code: true},
  ];

  dummyOperator = [
    {name: '=', code: 'NF'},
    {name: '>', code: 'S'},
    {name: '<', code: 'F'}
  ];

  private destroyer$ = new Subject();
  form!: FormGroup;
  userData!: UserDomain;
  ruleById: RuleDomain | undefined
  ruleGroups: RuleGroupDomain[] = []
  ruleBody: RuleBodyDomain[] = []
  conditionCounter: number = 1
  dialogMode: string = 'ADD'
  operation: string = "ADD"
  isLoading: boolean = true
  itemSelected: any

  visibleActionDialog: boolean = false;
  visibleLogicalDialog: boolean = false;
  visibleConstantDialog: boolean = false;
  visibleArithDialog: boolean = false;
  visibleListDialog: boolean = false;
  visibleLimitDialog: boolean = false;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private action$: Actions,
    private fb: FormBuilder,
    private ruleGroupService: RuleGroupService,
    private ruleService: RuleService,
    private confirmService: ConfirmService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      ruleId: [{value: '', disabled: true}, Validators.required],
      type: [{value: {value: 'Standard', code: 1}, disabled: true}, Validators.required],
      ruleName: ['', Validators.required],
      ruleGroup: ['', Validators.required],
      riskValue: ['', [Validators.required, maxThreeDigitsValidator()]],
      isActive: [{value: {value: 'Not Active', code: false}, disabled: true}, Validators.required],
      priority: ['', Validators.required],
      description: [''],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required],
      sformula: ['', Validators.required],
    })

    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userData = data

      if (this.userData != undefined) {
        this.isLoading = true
        this.getRuleGroup()

        if (this.router.url.includes('edit')) {
          this.operation = 'EDIT'
          this.ruleService.onGetAllInformation(
            (ctx) => {
              ForkJoinHelper(
                [ctx.dispatch(new RuleGetById(Number(this.router.url.split('/').pop())))],
                this.destroyer$,
                () => {
                  if (this.ruleById != undefined) {
                    this.getRuleId()?.setValue(this.ruleById.ruleId)
                    this.getRuleName()?.setValue(this.ruleById.ruleName)
                    this.getRuleGroupField()?.setValue(this.ruleById.ruleGroup)
                    this.getRiskValue()?.setValue(this.ruleById.riskValue)
                    this.getPriority()?.setValue(this.StringUtils.priority.find(v1 => v1.code == this.ruleById?.priority.toString()))
                    this.getStatus()?.setValue(this.ruleStatus.find(v1 => v1.code == this.ruleById?.isActive))

                    this.getDescription()?.setValue(this.ruleById.description)

                    if (this.ruleById.dateFrom != null || this.ruleById.dateFrom != undefined || this.ruleById.dateFrom != '') {
                      this.getDateFrom()?.setValue(DateUtils.ConvertToDateFormat(this.ruleById.dateFrom))
                    }

                    if (this.ruleById.dateTo != null || this.ruleById.dateTo != undefined || this.ruleById.dateTo != '') {
                      this.getDateTo()?.setValue(DateUtils.ConvertToDateFormat(this.ruleById.dateTo))
                    }
                    this.getFormula()?.setValue(this.ruleById.sformula)

                    this.ruleBody = this.removeDuplicates(this.ruleById.ruleBodies)

                    const sortData = this.ruleById.ruleBodies.sort((a: any, b: any) => parseInt(a.conditionId.replace('S', '')) - parseInt(b.conditionId.replace('S', '')))
                    const indexS = sortData[this.ruleById.ruleBodies.length - 1]

                    if (indexS) {
                      this.conditionCounter = parseInt(indexS.conditionId.replace('S', '')) + 1
                    }
                  }

                  setTimeout(() => {
                    this.isLoading = false
                  }, 200)
                }
              )
            }
          )
        }
      }
      else this.isLoading = false
    })

    this.ruleGroups$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.ruleGroups = data
    })

    this.rule$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
        this.ruleById = data
      }
    )

    this.action$
      .pipe(
        ofActionSuccessful(RuleAdd, RuleUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
      this.isLoading = false

      this.ruleService.onResetAllInformation(
        (ctx) => {
          ctx.setState({
            ...ctx.getState(),
            rules: [],
            rule: undefined
          })
        }
      )

      this.ngZone.run(() => {
        this.router.navigate([RoutePathEnum.RULE_PATH])
          .then(() => {
          })
      })
    })

    this.action$
      .pipe(
        ofActionCompleted(RuleAdd, RuleUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onAddCondition() {
    this.dialogMode = 'ADD'
    this.visibleActionDialog = !this.visibleActionDialog;
  }

  onDeleteCondition(event: any) {
    this.confirmService.showDialogConfirm(() => {
      let existingDataIndex = this.ruleBody.findIndex(v1 => v1.conditionId == this.itemSelected.conditionId)
      this.ruleBody.splice(existingDataIndex, 1)
      this.itemSelected = undefined
    })
  }

  onLoadingCondition(stat: boolean) {
    this.isLoading = stat
  }

  onLogicalClicked() {
    this.visibleActionDialog = false;
    this.visibleLogicalDialog = !this.visibleLogicalDialog;
  }

  onCloseLogical(stat: boolean) {
    this.visibleLogicalDialog = stat
  }

  onConstantClicked() {
    this.visibleActionDialog = false;
    this.visibleConstantDialog = !this.visibleConstantDialog;
  }

  onCloseConstant(stat: boolean) {
    this.visibleConstantDialog = stat
  }

  onArithClicked() {
    this.visibleActionDialog = false;
    this.visibleArithDialog = !this.visibleArithDialog;
  }

  onCloseArith(stat: boolean) {
    this.visibleArithDialog = stat
  }

  onListClicked() {
    this.visibleActionDialog = false;
    this.visibleListDialog = !this.visibleListDialog;
  }

  onCloseList(stat: boolean) {
    this.visibleListDialog = stat
  }

  onLimitClicked() {
    this.visibleActionDialog = false;
    this.visibleLimitDialog = !this.visibleLimitDialog;
  }

  onCloseLimit(stat: boolean) {
    this.visibleLimitDialog = stat
  }

  onAddRuleBody(data: RuleBodyDomain) {
    let existingData = this.ruleBody.findIndex(v1 => v1.conditionId == data.conditionId)
    if (this.ruleBody[existingData]) {
      this.ruleBody[existingData] = data
      this.itemSelected = data
    } else {
      this.ruleBody = [...this.ruleBody, data]
    }
    this.conditionCounter += 1
  }

  onEditRuleBody() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    switch (this.itemSelected.condition) {
      case 'LOGICAL':
        this.onLogicalClicked()
        break

      case 'CONSTANT':
        this.onConstantClicked()
        break

      case 'LIST':
        this.onListClicked()
        break

      case 'ARITHMETIC':
        this.onArithClicked()
        break

      case 'LIMIT':
        this.onLimitClicked()
        break
    }
  }

  onClose() {
    this.form.reset()
  }

  onCancel() {
    this.ruleService.onResetAllInformation(
      (ctx) => {
        ctx.setState({
          ...ctx.getState(),
          rule: undefined
        })

        this.ngZone.run(() => {
          this.router.navigate([RoutePathEnum.RULE_PATH])
        })
      }
    )
  }

  onSave(data: any) {
    this.isLoading = true

    data.author = this.userData.username
    data.dateFrom = DateUtils.ConvertToTimestampFormat(data.dateFrom)
    data.dateTo = DateUtils.ConvertToTimestampFormat(data.dateTo)
    data.type = data.type.code
    data.isActive = data.isActive.code
    data.priority = data.priority.code
    data.ruleBodies = this.ruleBody

    if (this.operation == 'EDIT') {
      this.ruleService.onUpdateRule(data)
    } else this.ruleService.onAddRule(data)
  }

  getRuleGroup() {
    this.ruleGroupService.onGetAllInformation(
      (ctx) => {
        forkJoin([
          ctx.dispatch(new RuleGroupGet(Number(this.userData.userGroup?.id)))
        ]).pipe(
          takeUntil(this.destroyer$),
          catchError(() => {
            return of(null)
          }),
        ).subscribe({
          complete: () => {
            if (!this.router.url.includes('edit')) {
              this.isLoading = false
            }
          }
        })
      }
    )
  }

  isValueNotValid() {
    const stat = this.getRuleName()?.hasError('required') || this.getRiskValue()?.hasError('required') ||
      this.getStatus()?.hasError('required') || this.getPriority()?.hasError('required') || this.getDateFrom()?.hasError('required') ||
      this.getDateTo()?.hasError('required') || this.getFormula()?.hasError('required') ||
      this.getRuleGroupField()?.hasError('required')

    if (stat != undefined)
      return stat

    return true
  }

  getRuleId() {
    return this.form.get('ruleId')
  }

  getType() {
    return this.form.get('type')
  }

  getRuleName() {
    return this.form.get('ruleName')
  }

  getRuleGroupField() {
    return this.form.get('ruleGroup')
  }

  getRiskValue() {
    return this.form.get('riskValue')
  }

  getStatus() {
    return this.form.get('isActive')
  }

  getPriority() {
    return this.form.get('priority')
  }

  getDescription() {
    return this.form.get('description')
  }

  getDateFrom() {
    return this.form.get('dateFrom')
  }

  getDateTo() {
    return this.form.get('dateTo')
  }

  getFormula() {
    return this.form.get('sformula')
  }


  removeDuplicates(data: RuleBodyDomain[]): RuleBodyDomain[] {
    const uniqueData: { [key: string]: RuleBodyDomain } = {};

    for (const item of data) {
      uniqueData[Number(item.id)] = item;
    }

    return Object.values(uniqueData);
  }

  protected readonly StringUtils = StringUtils;
}
