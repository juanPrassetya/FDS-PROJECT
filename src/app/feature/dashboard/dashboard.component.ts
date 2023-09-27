import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EChartsOption, SeriesOption} from 'echarts';
import {Actions, ofActionCompleted, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../user/domain/user.domain";
import {DashboardService} from "./service/dashboard.service";
import {DashboardState} from "./state/dashboard.state";
import {TransactionActivityDomain} from "./domain/transaction-activity.domain";
import {ALERT_CASE_ACTIVITY_CHART_OPT, TRANS_ACTIVITY_CHART_OPT} from "./utils/chart.opt";
import {DashboardGetAllInformation} from "./state/dashboard.actions";
import {AlertCaseAnalyticDomain} from "./domain/alert-case-analytic.domain";
import {TopRuleTriggeredDomain} from "./domain/top-rule-triggered.domain";
import { TransactionStatusDomain } from './domain/transaction-status.domain';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(DashboardState.transactionActivity) transactionActivity$!: Observable<TransactionActivityDomain[]>
  @Select(DashboardState.transactionStatus) transactionStatus$!: Observable<TransactionStatusDomain[]>
  @Select(DashboardState.alertCaseAnalytic) alertCaseAnalytic$!: Observable<AlertCaseAnalyticDomain>
  @Select(DashboardState.topRuleTriggered) topRuleTriggered$!: Observable<TopRuleTriggeredDomain[]>

  private destroyer$ = new Subject();

  transactionStatus: Array<TransactionStatusDomain> = []

  transActivityDateData: string[] = []
  transActivityApprovedData: number[] = []
  transActivityDeclineData: number[] = []
  transActivityChartOpt: EChartsOption = TRANS_ACTIVITY_CHART_OPT(this.transActivityDateData, this.transActivityApprovedData, this.transActivityDeclineData)

  //For default style pie
  alertCaseActivityNotClassifiedData: number = 0
  alertCaseActivityPositiveData: number = 0
  alertCaseActivitySuspiciousData: number = 0
  alertCaseActivityNegativeData: number = 0
  alertCaseActivityChartOpt: EChartsOption = ALERT_CASE_ACTIVITY_CHART_OPT(
    this.alertCaseActivityNotClassifiedData, this.alertCaseActivityPositiveData, this.alertCaseActivitySuspiciousData, this.alertCaseActivityNegativeData
  )

  topRuleTriggeredData: TopRuleTriggeredDomain[] = []

  isLoading: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
    private dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(
        data => {
          if (data != undefined) {
            this.isLoading = true
            this.dashboardService.onFetchAllInformation()
            this.dashboardService.onFetchTransactionStatus();
          } else {
            this.isLoading = false
          }
        }
      )

    this.transactionActivity$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(
      data => {
        if (data.length > 0) {

          data.forEach(v1 => {
              this.transActivityDateData.push(v1.convertedDate)
              this.transActivityApprovedData.push(v1.approveTotal)
              this.transActivityDeclineData.push(v1.declinedTotal)
            }
          )

          this.transActivityChartOpt = TRANS_ACTIVITY_CHART_OPT(this.transActivityDateData, this.transActivityApprovedData, this.transActivityDeclineData)
        }
      }
    )


    this.alertCaseAnalytic$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(
      data => {
        if (data != undefined) {
          // const dataChart = ((this.alertCaseActivityChartOpt.series as SeriesOption).data as any[])
          // for (let i = 0; i < dataChart.length; i++) {
          //   switch (i) {
          //     case 0:
          //       dataChart[i].label.formatter = '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + data.notClassified + '  '
          //       break;
          //     case 1:
          //       dataChart[i].label.formatter = '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + data.positive + '  '
          //       break;
          //     case 2:
          //       dataChart[i].label.formatter = '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + data.suspicious + '  '
          //       break;
          //     case 3:
          //       dataChart[i].label.formatter = '{a|{a}}{abg|}\n{hr|}\n  {a|{b}：}' + data.negative + '  '
          //       break;
          //   }
          // }

          this.alertCaseActivityChartOpt = ALERT_CASE_ACTIVITY_CHART_OPT(
            data.notClassified, data.positive, data.suspicious, data.negative
          )
          this.alertCaseActivitySuspiciousData = data.suspicious 
        }
      }
    )

    this.topRuleTriggered$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(
      data => {
        this.topRuleTriggeredData = data
      }
    )

    this.transactionStatus$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(
      data => {
        this.transactionStatus = data
        console.log(this.transactionStatus)
      }
    )

    this.action$.pipe(
      ofActionCompleted(DashboardGetAllInformation),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.dashboardService.onResetAllInformation()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  isDataNotNull(data: any) {
    return data != undefined;
  }
}
