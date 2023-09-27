import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  AlertInvestigationActionForwardedTo,
  AlertInvestigationClassifyAlert,
  AlertInvestigationGet,
  AlertInvestigationGetAllInformation,
  AlertInvestigationGetDemografi,
  AlertInvestigationGetHistory,
  AlertInvestigationGetLockByUsername,
  AlertInvestigationGetQuery,
  AlertInvestigationGetTriggeredRule,
  AlertInvestigationLockCase,
  AlertInvestigationTakeAction,
  AlertInvestigationUnLockCase
} from "./alert-investigation.actions";
import {AlertInvestigationDomain} from "../domain/alert-investigation.domain";
import {AlertInvestigationDataDomain} from "../domain/alert-investigation-data.domain";
import {StateContext} from "@ngxs/store";
import {TransactionStateModel} from "../../transaction/state/transaction.state";
import {AlertInvestigationStateModel} from "./alert-investigation.state";

@Injectable({
  providedIn: 'root'
})
export class AlertInvestigationDispatcher {

  @Dispatch()
  public _AlertInvestigationGet(lockedBy: string) {
    return new AlertInvestigationGet(lockedBy)
  }

  @Dispatch()
  public _AlertInvestigationGetQuery(data: any) {
    return new AlertInvestigationGetQuery(data)
  }

  @Dispatch()
  public _AlertInvestigationGetLockByUsername(username: string) {
    return new AlertInvestigationGetLockByUsername(username)
  }

  @Dispatch()
  public _AlertInvestigationGetHistory(caseId: number) {
    return new AlertInvestigationGetHistory(caseId)
  }

  @Dispatch()
  public _AlertInvestigationGetDemografi(utrnno: string, refnum: string) {
    return new AlertInvestigationGetDemografi(utrnno, refnum)
  }

  @Dispatch()
  public _FetchAllAlertInvestigationTriggeredRule(utrnno: string) {
    return new AlertInvestigationGetTriggeredRule(utrnno);
  }

  @Dispatch()
  public _AlertInvestigationLockCase(data: AlertInvestigationDomain) {
    return new AlertInvestigationLockCase(data)
  }

  @Dispatch()
  public _AlertInvestigationUnLockCase(data: AlertInvestigationDomain) {
    return new AlertInvestigationUnLockCase(data)
  }

  @Dispatch()
  public _AlertInvestigationClassifyAlert(data: AlertInvestigationDomain) {
    return new AlertInvestigationClassifyAlert(data)
  }

  @Dispatch()
  public _AlertInvestigationTakeAction(data: AlertInvestigationDomain) {
    return new AlertInvestigationTakeAction(data)
  }

  @Dispatch()
  public _AlertInvestigationActionForwardedTo(data: AlertInvestigationDomain) {
    return new AlertInvestigationActionForwardedTo(data)
  }

  @Dispatch()
  public _AlertInvestigationGetAllInformation(action: (ctx: StateContext<AlertInvestigationStateModel>) => void) {
    return new AlertInvestigationGetAllInformation(action)
  }
}
