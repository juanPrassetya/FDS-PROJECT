import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  TransactionAssignFraudFlag,
  TransactionGet,
  TransactionGetAddtData,
  TransactionGetAllInformation,
  TransactionGetByHpan,
  TransactionGetByQuery,
  TransactionGetTriggeredRule,
  TransactionResetAllInformation
} from "./transaction.actions";
import {TransactionDomain} from "../domain/transaction.domain";
import {StateContext} from "@ngxs/store";
import {TransactionStateModel} from "./transaction.state";

@Injectable({
  providedIn: 'root'
})
export class TransactionDispatcher {

  @Dispatch()
  public _FetchAllTransaction() {
    return new TransactionGet();
  }

  @Dispatch()
  public _FetchTransactionByQuery(data: any[]) {
    return new TransactionGetByQuery(data);
  }

  @Dispatch()
  public _FetchAllTransactionByHpan(data: {hpan: string, custId: string, acct1: string, alertDate: string}) {
    return new TransactionGetByHpan(data);
  }

  @Dispatch()
  public _FetchAllTransactionTriggeredRule(utrnno: string) {
    return new TransactionGetTriggeredRule(utrnno);
  }

  @Dispatch()
  public _FetchAllTransactionAddtData(utrnno: string) {
    return new TransactionGetAddtData(utrnno);
  }

  @Dispatch()
  public _FetchAllTransactionInformation(action: (ctx: StateContext<TransactionStateModel>) => void) {
    return new TransactionGetAllInformation(action);
  }

  @Dispatch()
  public _AssignFraudFlag(data: TransactionDomain) {
    return new TransactionAssignFraudFlag(data);
  }

  @Dispatch()
  public _TransactionResetAllInformation(action: (ctx: StateContext<TransactionStateModel>) => void) {
    return new TransactionResetAllInformation(action);
  }
}
