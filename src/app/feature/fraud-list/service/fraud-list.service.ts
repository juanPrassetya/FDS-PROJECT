import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FraudListDispatcher} from "../state/fraud-list.dispatcher";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {FraudListDomain} from "../domain/fraud-list.domain";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {StateContext} from "@ngxs/store";
import {FraudListStateModel} from "../state/fraud-list.state";

@Injectable({
  providedIn: 'root'
})
export class FraudListService {
  private apiUrl = environment.dev_env
  constructor(
    private http: HttpClient,
    private fraudListDispatcher: FraudListDispatcher
  ) { }

  getFraudList() {
    return this.http.get<CustomHttpResponse<FraudListDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_GET_PATH}`)
  }

  getFraudListByQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_GET_QUERY_PATH}`, data)
  }

  getFraudListByEntity(entity: number) {
    const params = new HttpParams().set('entityTypeId', entity);

    return this.http.get<CustomHttpResponse<FraudListDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_GET_BY_ENTITY_PATH}`, {params})
  }

  addFraudList(data: FraudListDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_ADD_PATH}`, data)
  }

  updateFraudList(currentListName: string, data: FraudListDomain) {
    const params = new HttpParams().set('currentListName', currentListName);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_UPDATE_PATH}`, data, {params})
  }

  deleteFraudList(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_DELETE_PATH}/${id}`)
  }

  onGetFraudList() {
    this.fraudListDispatcher._FraudListGet()
  }

  onGetFraudListQuery(data: any) {
    this.fraudListDispatcher._FraudListGetQuery(data);
  }

  onGetFraudListByEntity(entity: number) {
    this.fraudListDispatcher._FraudListGetByEntity(entity)
  }

  onAddFraudList(data: FraudListDomain) {
    this.fraudListDispatcher._FraudListAdd(data)
  }

  onUpdateFraudList(currentListName: string, data: FraudListDomain) {
    this.fraudListDispatcher._FraudListUpdate(currentListName, data)
  }

  onDeleteFraudList(id: number) {
    this.fraudListDispatcher._FraudListDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<FraudListStateModel>) => void) {
    this.fraudListDispatcher._FraudListGetAllInformation(action)
  }

  onResetAllInformation(action: (ctx: StateContext<FraudListStateModel>) => void) {
    this.fraudListDispatcher._FraudListResetAllInformation(action)
  }
}
