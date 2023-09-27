import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {FraudReactionsDomain} from "../domain/fraud-reactions.domain";
import {FraudReactionsDispatcher} from "../state/fraud-reactions.dispatcher";
import {StateContext} from "@ngxs/store";
import {FraudReactionStateModel} from "../state/fraud-reactions.state";

@Injectable({
  providedIn: 'root'
})
export class FraudReactionsService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private fraudReactionsDispatcher: FraudReactionsDispatcher
  ) { }

  getFraudReactions() {
    return this.http.get<CustomHttpResponse<FraudReactionsDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_REACTIONS_GET_PATH}`);
  }

  getFraudReactionsQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_REACTIONS_QUERY_PATH}`, data);
  }

  getFraudReactionsByBindingIdAndType(id: number, type: string) {
    const params = new HttpParams()
      .set('bindingId', id)
      .append('bindingType', type);

    return this.http.get<CustomHttpResponse<FraudReactionsDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_REACTIONS_GET_BY_BINDING_PATH}`, {params});
  }

  addFraudReactions(data: FraudReactionsDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_REACTIONS_ADD_PATH}`, data);
  }

  updateFraudReactions(data: FraudReactionsDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_REACTIONS_UPDATE_PATH}`, data);
  }

  deleteFraudReactions(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_REACTIONS_DELETE_PATH}/${id}`);
  }

  onGetFraudReactions(){
    this.fraudReactionsDispatcher._FraudReactionsGet()
  }

  onGetFraudReactionsByQuery(data: any) {
    this.fraudReactionsDispatcher._FraudReactionsGetQuery(data);
  }

  onGetFraudReactionsByBindingIdAndType(id: number, type: string) {
    this.fraudReactionsDispatcher._FraudReactionsGetByBindingIdAndType(id, type)
  }

  onAddFraudReactions(data: FraudReactionsDomain) {
    this.fraudReactionsDispatcher._FraudReactionsAdd(data)
  }

  onUpdateFraudReactions(data: FraudReactionsDomain) {
    this.fraudReactionsDispatcher._FraudReactionsUpdate(data)
  }

  onDeleteFraudReactions(id: number) {
    this.fraudReactionsDispatcher._FraudReactionsDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<FraudReactionStateModel>) => void) {
    this.fraudReactionsDispatcher._FraudReactionsGetAllInformation(action)
  }
}
