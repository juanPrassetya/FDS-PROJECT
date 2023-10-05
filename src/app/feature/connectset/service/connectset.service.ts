import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {ConnectsetDomain} from "../domain/connectset.domain";
import { ConnectsetDispatcher } from '../state/connectset.dispatcher';
@Injectable({
  providedIn: 'root'
})
export class ConnectsetService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private connectsetDispatcher: ConnectsetDispatcher
  ) { }

  getConnectset() {
    return this.http.get<CustomHttpResponse<ConnectsetDomain[]>>(`${this.apiUrl}/${RoutePathEnum.CONNECTSET_GET_PATH}`);
  }

  getConnectsetQuery(data: any) {
    return this.http.post<CustomHttpResponse<ConnectsetDomain[]>>(`${this.apiUrl}/${RoutePathEnum.CONNECTSET_GET_QUERY_PATH}`, data);
  }

  addConnectset(data: ConnectsetDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.CONNECTSET_ADD_PATH}`, data);
  }

  updateConnectset(currentName: string, data: ConnectsetDomain) {
    const params = new HttpParams()
      .set('currentConnectsetName', currentName)
      .append('connectsetName', data.connectsetName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.CONNECTSET_UPDATE_PATH}`, '', {params});
  }

  deleteConnectset(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.CONNECTSET_DELETE_PATH}/${id}`);
  }

  onFetchConnectset() {
    this.connectsetDispatcher._ConnectsetGet()
  }

  onFetchConnectsetQuery(data: any) {
    this.connectsetDispatcher._ConnectsetGetQuery(data)
  }

  onAddConnectset(data: ConnectsetDomain) {
    this.connectsetDispatcher._ConnectsetAdd(data)
  }

  onUpdateConnectset(currentName: string, data: ConnectsetDomain) {
    this.connectsetDispatcher._ConnectsetUpdate(currentName, data)
  }

  onDeleteConnectset(id: number) {
    this.connectsetDispatcher._ConnectsetDelete(id)
  }

}
