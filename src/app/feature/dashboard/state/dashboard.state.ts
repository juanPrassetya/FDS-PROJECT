import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {TransactionActivityDomain} from "../domain/transaction-activity.domain";
import {DashboardService} from "../service/dashboard.service";
import {lastValueFrom, tap} from "rxjs";
import {
  DashboardGetAlertCaseAnalytic,
  DashboardGetAllInformation,
  DashboardGetTopRuleTriggered, DashboardResetAllInformation,
  TransactionGetActivity,
  TransactionGetStatus
} from "./dashboard.actions";
import {AlertCaseAnalyticDomain} from "../domain/alert-case-analytic.domain";
import {TopRuleTriggeredDomain} from "../domain/top-rule-triggered.domain";
import { TransactionStatusDomain } from "../domain/transaction-status.domain";

export class DashboardStateModel {
  transactionActivity: TransactionActivityDomain[] = [];
  topRuleTriggered: TopRuleTriggeredDomain[] = [];
  alertCaseAnalytic: AlertCaseAnalyticDomain | undefined;
  transactionStatus: TransactionStatusDomain[] = [];
}

@State<DashboardStateModel>({
  name: 'dashboardState',
  defaults: {
    transactionActivity: [],
    topRuleTriggered: [],
    alertCaseAnalytic: undefined,
    transactionStatus: []
  }
})

@Injectable()
export class DashboardState {

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static transactionActivity(state: DashboardStateModel) {
    return state.transactionActivity;
  }

  @Selector()
  static transactionStatus(state: DashboardStateModel) {
    return state.transactionStatus;
  }

  @Selector()
  static alertCaseAnalytic(state: DashboardStateModel) {
    return state.alertCaseAnalytic;
  }

  @Selector()
  static topRuleTriggered(state: DashboardStateModel) {
    return state.topRuleTriggered;
  }

  @Action(TransactionGetActivity, {cancelUncompleted: true})
  getData(ctx: StateContext<DashboardStateModel>) {
    return this.dashboardService.fetchTransactionActivity().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          transactionActivity: response.responseData,
        })
      })
    )
  }

  @Action(TransactionGetStatus, {cancelUncompleted: true})
  getDataStatus(ctx: StateContext<DashboardStateModel>) {
    return this.dashboardService.fetchTransactionStatus().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          transactionStatus: response.responseData,
        })
      })
    )
  }

  @Action(DashboardGetAlertCaseAnalytic, {cancelUncompleted: true})
  getAlertCaseAnalytic(ctx: StateContext<DashboardStateModel>) {
    return this.dashboardService.fetchAlertCaseAnalytic().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          alertCaseAnalytic: response.responseData,
        })
      })
    )
  }

  @Action(DashboardGetTopRuleTriggered, {cancelUncompleted: true})
  getTopRuleTriggered(ctx: StateContext<DashboardStateModel>) {
    return this.dashboardService.fetchTopRuleTriggered().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          topRuleTriggered: response.responseData,
        })
      })
    )
  }

  @Action(DashboardGetAllInformation, {cancelUncompleted: true})
  async getAllInformation(ctx: StateContext<DashboardStateModel>) {
    await lastValueFrom(ctx.dispatch(new TransactionGetActivity()))
    await lastValueFrom(ctx.dispatch(new DashboardGetAlertCaseAnalytic()))
    await lastValueFrom(ctx.dispatch(new DashboardGetTopRuleTriggered()))
  }

  @Action(DashboardResetAllInformation, {cancelUncompleted: true})
  resetAllInformation(ctx: StateContext<DashboardStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      transactionActivity: [],
      topRuleTriggered: [],
      alertCaseAnalytic: undefined
    })
  }
}
