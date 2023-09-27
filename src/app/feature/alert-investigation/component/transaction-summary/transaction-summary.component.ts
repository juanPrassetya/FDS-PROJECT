import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TransactionDomain} from "../../../transaction/domain/transaction.domain";
import {AlertInvestigationDataDomain} from "../../domain/alert-investigation-data.domain";
import {TransactionService} from "../../../transaction/service/transaction.service";
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {TreeNode} from "primeng/api";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {Actions, Select, Store} from "@ngxs/store";
import {TransactionState} from "../../../transaction/state/transaction.state";
import {TriggeredRuleDomain} from "../../../transaction/domain/triggered-rule.domain";
import {TransactionGetAddtData, TransactionGetTriggeredRule} from "../../../transaction/state/transaction.actions";
import {RuleDomain} from "../../../rule/domain/rule.domain";
import {TransactionAddtDomain} from "../../../transaction/domain/transaction-addt.domain";

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css']
})
export class TransactionSummaryComponent implements OnInit, OnDestroy {
  @Input() transactions: Map<string, object>[] = []
  @Input() alertData: AlertInvestigationDataDomain | undefined

  @Select(TransactionState.triggeredRule) triggeredRule$!: Observable<TriggeredRuleDomain[]>
  @Select(TransactionState.addtData) addtData$!: Observable<TransactionAddtDomain[]>

  private destroyer$ = new Subject();

  selectedItem: TransactionDomain | undefined
  convertedItem: Map<string, object> = new Map<string, object>()
  triggeredRule: TreeNode[] = []
  addtData: TransactionAddtDomain[] = []

  visibleTransactionDialog: boolean = false
  isLoading: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private store$: Store,
    private action$: Actions,
  ) {
  }

  ngOnInit() {
    this.addtData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.addtData = data
    })

    this.triggeredRule$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      if (data.length > 0) {
        try {
          const v1Container = new Map<bigint, TreeNode>

          data.forEach(v1 => {
            let convertedRule: RuleDomain = JSON.parse(v1.detailObj)
            let existingGroup = v1Container.get(convertedRule.ruleGroup.id)

            if (existingGroup != undefined) {
              if (existingGroup.children) {
                const v2 = {
                  label: 'Rule ' + convertedRule.ruleId + ' ' + convertedRule.ruleName,
                  children: [
                    {
                      label: 'Risk Value ' + convertedRule.riskValue
                    },
                    {
                      label: 'Date From ' + DateUtils.ConvertToDateFormat(convertedRule.dateFrom)
                    },
                    {
                      label: 'Date To ' + DateUtils.ConvertToDateFormat(convertedRule.dateTo)
                    },
                    {
                      label: 'Formula',
                      children: [
                        {
                          label: ''
                        }
                      ]
                    },
                  ]
                }

                convertedRule.ruleBodies.forEach(v3 => {
                  if (v2.children[3].children) {
                    v2.children[3].children.pop()
                    v2.children[3].children.push(
                      {
                        label: v3.conditionId + ' ' + v3.condition + ' - ' + v3.detailCondition
                      }
                    )
                  }
                })

                existingGroup.children[3].children?.push(v2)
              }
            } else {
              const v2 = {
                label: 'Group ' + convertedRule.ruleGroup.id + ' ' + convertedRule.ruleGroup.groupName,
                children: [
                  {
                    label: 'Priority ' + convertedRule.ruleGroup.priority
                  },
                  {
                    label: 'Threshold Black ' + convertedRule.ruleGroup.threshouldBlack
                  },
                  {
                    label: 'Threshold Grey ' + convertedRule.ruleGroup.threshouldGrey
                  },
                  {
                    label: 'Rules',
                    children: [
                      {
                        label: 'Rule ' + convertedRule.ruleId + ' ' + convertedRule.ruleName,
                        children: [
                          {
                            label: 'Risk Value ' + convertedRule.riskValue
                          },
                          {
                            label: 'Date From ' + DateUtils.ConvertToDateFormat(convertedRule.dateFrom)
                          },
                          {
                            label: 'Date To ' + DateUtils.ConvertToDateFormat(convertedRule.dateTo)
                          },
                          {
                            label: 'Formula',
                            children: [
                              {
                                label: ''
                              }
                            ]
                          },
                        ]
                      }
                    ]
                  }
                ]
              }

              convertedRule.ruleBodies.forEach(v3 => {
                if (v2.children[3].children) {
                  v2.children[3].children[0].children[3].children?.pop()
                  v2.children[3].children[0].children[3].children?.push(
                    {
                      label: v3.conditionId + ' ' + v3.condition + ' - ' + v3.detailCondition
                    }
                  )
                }
              })

              v1Container.set(convertedRule.ruleGroup.id, v2)
            }
          })

          v1Container.forEach((value, key) => {
            this.triggeredRule.push(value)
          })
        } catch (err) {
          console.log(err)
        }
      }
    })
  }

  ngOnDestroy() {
    this.transactionService.onResetAllInformation(
      (ctx) => {
        ctx.setState({
          ...ctx.getState(),
          triggeredRule: [],
        })
      }
    )
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onRowClicked() {

  }

  onRowUnClicked() {
    this.convertedItem = new Map<string, object>()
  }

  onDetailClicked(item: any) {
    this.isLoading = true
    this.selectedItem = item

    if (this.selectedItem != undefined) {
      this.convertedItem = new Map<string, object>(Object.entries(this.selectedItem))
      this.transactionService.onFetchAllInformation(
        (ctx) => {
          forkJoin([
            ctx.dispatch(new TransactionGetTriggeredRule(item.utrnno)),
            ctx.dispatch(new TransactionGetAddtData(item.utrnno))
          ]).subscribe(() => {
            this.isLoading = false
            this.visibleTransactionDialog = true
          })
        }
      )
    }
  }

  onCloseTransDetailDialog(stat: boolean) {
    this.visibleTransactionDialog = stat
    this.triggeredRule = []
  }

  getSev(status: String): string {
    if (status == '2') {
      return 'flag-status-color fraud-color';
    }

    if (status == '0') {
      return 'flag-status-color not-fraud-color';
    }

    if (status == '1') {
      return 'flag-status-color suspicious-color';
    }

    return ''
  }

  getFraudFlag(fraudFlags: any) {
    switch (fraudFlags) {
      case 0:
        return 'NOT FRAUD'

      case 1:
        return 'SUSPICIOUS'

      case 2:
        return 'FRAUD'

      default:
        return 'UNKNOWN'
    }
  }

  isTransDeclined(respCode: string) {
    if (respCode != '-1' && respCode != '201') {
      return 'resp-code-declined'
    } else return ''
  }

  isRuleTriggered(data: any): string {
    if (data.utrnno === this.alertData?.utrnno) {
      return 'row-accessories'
    }

    if (data.ruleTrigger > 0 && (data.respCode == '-1' || data.respCode == '201')) {
      return 'rule-trigger-color';
    } else if ((data.ruleTrigger > 0 || data.ruleTrigger < 0) && (data.respCode != '-1' || data.respCode != '201')) {
      return 'rule-trigger-decline-color';
    }
    return '';
  }
}
