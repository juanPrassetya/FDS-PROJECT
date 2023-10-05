import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { RescodeDomain } from '../domain/rescode.domain';
import { RescodeDispatcher } from '../state/rescode.dispatcher';
@Injectable({
  providedIn: 'root'
})
export class RescodeService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private rescodeDispatcher: RescodeDispatcher
  ) { }

  getRescode() {
    return this.http.get<CustomHttpResponse<RescodeDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RESCODE_GET_PATH}`);
  }

  getRescodeQuery(data: any) {
    return this.http.post<CustomHttpResponse<RescodeDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RESCODE_GET_QUERY_PATH}`, data);
  }

  addRescode(data: RescodeDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RESCODE_ADD_PATH}`, data);
  }

  updateRescode(currentName: string, data: RescodeDomain) {
    const params = new HttpParams()
      .set('currentRescodeName', currentName)
      .append('rescodeName', data.rescodeName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RESCODE_UPDATE_PATH}`, '', {params});
  }

  deleteRescode(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RESCODE_DELETE_PATH}/${id}`);
  }

  onFetchRescode() {
    this.rescodeDispatcher._RescodeGet()
  }

  onFetchRescodeQuery(data: any) {
    this.rescodeDispatcher._RescodeGetQuery(data)
  }

  onAddRescode(data: RescodeDomain) {
    this.rescodeDispatcher._RescodeAdd(data)
  }

  onUpdateRescode(currentName: string, data: RescodeDomain) {
    this.rescodeDispatcher._RescodeUpdate(currentName, data)
  }

  onDeleteRescode(id: number) {
    this.rescodeDispatcher._RescodeDelete(id)
  }

}
