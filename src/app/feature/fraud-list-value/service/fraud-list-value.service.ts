import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {FraudListValueDomain} from "../domain/fraud-list-value.domain";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {FraudListValueDispatcher} from "../state/fraud-list-value.dispatcher";
import {StateContext} from "@ngxs/store";
import {FraudListValueStateModel} from "../state/fraud-list-value.state";

@Injectable({
  providedIn: 'root'
})
export class FraudListValueService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private fraudListValueDispatcher: FraudListValueDispatcher
  ) {
  }

  addFraudListValue(data: FraudListValueDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_VALUE_ADD_PATH}`, data)
  }

  updateFraudListValue(currentValue: string, data: FraudListValueDomain) {
    const params = new HttpParams().set('currentValue', currentValue);

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_VALUE_UPDATE_PATH}`, data, {params})
  }

  deleteFraudListValue(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_VALUE_DELETE_PATH}/${id}`)
  }

  getFraudListValueById(id: number) {
    const params = new HttpParams().set('listId', id);

    return this.http.get<CustomHttpResponse<FraudListValueDomain[]>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_VALUE_GET_BY_ID_PATH}`,
      {params}
    )
  }

  upload(data: {file: any, author: string, listId: string}) {
    const formData = new FormData()
    formData.set('listId', data.listId)
    formData.set('author', data.author)
    formData.set('file', data.file, data.file.name)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.FRAUD_LIST_VALUE_UPLOAD_PATH}`, formData)
  }

  onAddFraudListValue(data: FraudListValueDomain) {
    this.fraudListValueDispatcher._FraudListValueAdd(data)
  }

  onUpdateFraudListValue(currentValue: string, data: FraudListValueDomain) {
    this.fraudListValueDispatcher._FraudListValueUpdate(currentValue, data)
  }

  onDeleteFraudListValue(id: number) {
    this.fraudListValueDispatcher._FraudListValueDelete(id)
  }

  onGetFraudListValueById(id: number) {
    this.fraudListValueDispatcher._FraudListValueGetById(id)
  }

  onUpload(data: {file: any, author: string, listId: string}) {
    this.fraudListValueDispatcher._FraudListValueUpload(data)
  }

  onResetAllInformation(action: (ctx: StateContext<FraudListValueStateModel>) => void) {
    this.fraudListValueDispatcher._FraudListValueResetAllInformation(action)
  }
}
