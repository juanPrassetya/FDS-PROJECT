import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {TransactionDomain} from "../domain/transaction.domain";
import {TransactionDispatcher} from "../state/transaction.dispatcher";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {TriggeredRuleDomain} from "../domain/triggered-rule.domain";
import {TransactionAddtDomain} from "../domain/transaction-addt.domain";
import {StateContext} from "@ngxs/store";
import {TransactionStateModel} from "../state/transaction.state";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private transactionDispatcher: TransactionDispatcher
  ) {
  }

  fetchAllTransaction() {
    return this.http.get<CustomHttpResponse<Array<Map<string, object>>>>(`${this.apiUrl}/transaction/list`);
  }

  fetchTransactionQuery(data: any[]) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/transaction/search`, data)
  }

  fetchTransactionByHpan(data: {hpan: string, custId: string, acct1: string, alertDate: string}) {
    return this.http.post<CustomHttpResponse<Array<Map<string, object>>>>(`${this.apiUrl}/${RoutePathEnum.TRANSACTION_GET_BY_HPAN_PATH}`, data);
  }

  fetchTriggeredRule(utrnno: string) {
    const params = new HttpParams().set('utrnno', utrnno);

    return this.http.get<CustomHttpResponse<TriggeredRuleDomain[]>>(`${this.apiUrl}/${RoutePathEnum.TRANSACTION_GET_TRIGGERED_RULE}`, {params});
  }

  fetchAddData(utrnno: string) {
    const params = new HttpParams().set('utrnno', utrnno);

    return this.http.get<CustomHttpResponse<TransactionAddtDomain[]>>(`${this.apiUrl}/${RoutePathEnum.TRANSACTION_ADDT_GET_BY_HPAN_PATH}`, {params});
  }

  assignFlag(data: TransactionDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ASSIGN_FRAUD_FLAG}`, data);
  }

  onFetchAllTransaction() {
    this.transactionDispatcher._FetchAllTransaction()
  }

  onFetchTransactionByQuery(data: any[]) {
    this.transactionDispatcher._FetchTransactionByQuery(data)
  }

  onFetchAllTransactionByHpan(data: {hpan: string, custId: string, acct1: string, alertDate: string}) {
    this.transactionDispatcher._FetchAllTransactionByHpan(data)
  }

  onFetchTriggeredRule(utrnno: string) {
    this.transactionDispatcher._FetchAllTransactionTriggeredRule(utrnno)
  }

  onFetchAddtData(utrnno: string) {
    this.transactionDispatcher._FetchAllTransactionAddtData(utrnno)
  }

  onFetchAllInformation(action: (ctx: StateContext<TransactionStateModel>) => void) {
    this.transactionDispatcher._FetchAllTransactionInformation(action);
  }

  onAssignFraudFlag(data: TransactionDomain) {
    this.transactionDispatcher._AssignFraudFlag(data)
  }

  onResetAllInformation(action: (ctx: StateContext<TransactionStateModel>) => void) {
    this.transactionDispatcher._TransactionResetAllInformation(action)
  }
}
