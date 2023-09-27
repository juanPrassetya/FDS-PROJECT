import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {AlertInvestigationState} from "../../state/alert-investigation.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {AlertInvestigationDemografiDomain} from "../../domain/alert-investigation-demografi.domain";
import {CardDomain} from "../../domain/customer-domain/card.domain";
import {AccountDomain} from "../../domain/customer-domain/account.domain";
import {PersonDomain} from "../../domain/customer-domain/person.domain";
import {AlertInvestigationUnLockCase} from "../../state/alert-investigation.actions";
import {TreeNode} from "primeng/api";
import {TriggeredRuleDomain} from "../../../transaction/domain/triggered-rule.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {RuleDomain} from "../../../rule/domain/rule.domain";

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.css']
})
export class AlertDetailsComponent implements OnInit, OnDestroy {
  @Select(AlertInvestigationState.dataDemografi) demografiData$!: Observable<AlertInvestigationDemografiDomain>
  @Select(AlertInvestigationState.dataRule) triggeredRule$!: Observable<TriggeredRuleDomain[]>

  private destroyer$ = new Subject();

  cardData: Array<CardDomain> = []
  acctData: Array<AccountDomain> = []
  personData: PersonDomain | undefined
  triggeredRule: TreeNode[] = []

  visibleCardDialog: boolean = false
  visibleAcctDialog: boolean = false
  visiblePersonDialog: boolean = false
  visibleRuleDialog: boolean = false
  isLoading: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
  ) {
  }

  ngOnInit() {
    this.demografiData$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(data => {
        if (data != undefined) {
          this.cardData = data.cardList
          this.acctData = data.accountList

          if (data.custNumber?.person != undefined) {
            this.personData = data.custNumber.person
          }

          if (data.cardList.length > 0) {
            if (data.cardList[0] != undefined && this.personData == undefined) {
              this.personData = data.cardList[0].person
            }
          }

          if (data.accountList.length > 0) {
            if (data.accountList[0] != undefined && this.personData == undefined) {
              this.personData = data.accountList[0].person
            }
          }
        }
      })

    this.triggeredRule$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.triggeredRule = []
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

    this.action$.pipe(
      ofActionSuccessful(AlertInvestigationUnLockCase),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.cardData = []
      this.acctData = []
      this.personData = undefined
      this.triggeredRule = []
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onCardClicked() {
    this.isLoading = true
    this.visibleCardDialog = true
  }

  onCloseCard(stat: boolean) {
    this.visibleCardDialog = stat
  }

  onAccountClicked() {
    this.isLoading = true
    this.visibleAcctDialog = true
  }

  onCloseAccount(stat: boolean) {
    this.visibleAcctDialog = stat
  }

  onPersonClicked() {
    this.isLoading = true
    this.visiblePersonDialog = true
  }

  onClosePerson(stat: boolean) {
    this.visiblePersonDialog = stat
  }

  onRuleClicked() {
    this.isLoading = true
    this.visibleRuleDialog = true
  }

  onCloseRule(stat: boolean) {
    this.visibleRuleDialog = stat
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }
}
