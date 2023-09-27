import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  DashboardGetAlertCaseAnalytic,
  DashboardGetAllInformation,
  DashboardGetTopRuleTriggered, DashboardResetAllInformation,
  TransactionGetActivity,
  TransactionGetStatus
} from "./dashboard.actions";

@Injectable({
  providedIn: 'root'
})
export class DashboardDispatcher {
  @Dispatch()
  public _FetchAllTransactionActivity() {
    return new TransactionGetActivity();
  }

  @Dispatch()
  public _FetchAllTransactionStatus() {
    return new TransactionGetStatus();
  }

  @Dispatch()
  public _FetchAllAlertCaseAnalytic() {
    return new DashboardGetAlertCaseAnalytic();
  }

  @Dispatch()
  public _FetchAllTopRuleTriggered() {
    return new DashboardGetTopRuleTriggered();
  }

  @Dispatch()
  public _FetchAllInformation() {
    return new DashboardGetAllInformation();
  }

  @Dispatch()
  public _ResetAllInformation() {
    return new DashboardResetAllInformation();
  }
}
