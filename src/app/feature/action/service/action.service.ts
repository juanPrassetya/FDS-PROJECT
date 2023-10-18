import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { ActionDomain } from '../domain/action.component';
import { ActionDispatcher } from '../state/action.dispatcher';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private actionDispatcher: ActionDispatcher
  ) { }

  getAction() {
    return this.http.get<CustomHttpResponse<ActionDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ACTION_GET_PATH}`);
  }

  getActionQuery(data: any) {
    return this.http.post<CustomHttpResponse<ActionDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ACTION_GET_QUERY_PATH}`, data);
  }

  addAction(data: ActionDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ACTION_ADD_PATH}`, data);
  }

  updateAction(currentName: string, data: ActionDomain) {
    const params = new HttpParams()
      .set('currentActionName', currentName)
      .append('actionName', data.actionName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ACTION_UPDATE_PATH}`, '', {params});
  }

  deleteAction(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ACTION_DELETE_PATH}/${id}`);
  }

  onFetchAction() {
    this.actionDispatcher._ActionGet()
  }

  onFetchActionQuery(data: any) {
    this.actionDispatcher._ActionGetQuery(data)
  }

  onAddAction(data: ActionDomain) {
    this.actionDispatcher._ActionAdd(data)
  }

  onUpdateAction(currentName: string, data: ActionDomain) {
    this.actionDispatcher._ActionUpdate(currentName, data)
  }

  onDeleteAction(id: number) {
    this.actionDispatcher._ActionDelete(id)
  }

}
