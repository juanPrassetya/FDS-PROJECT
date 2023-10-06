import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { Tran2Domain } from '../domain/tran2.component';
import { Tran2Dispatcher } from '../state/tran2.dispatcher';

@Injectable({
  providedIn: 'root'
})
export class Tran2Service {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private tran2Dispatcher: Tran2Dispatcher
  ) { }

  getTran2() {
    return this.http.get<CustomHttpResponse<Tran2Domain[]>>(`${this.apiUrl}/${RoutePathEnum.TRAN2_GET_PATH}`);
  }

  getTran2Query(data: any) {
    return this.http.post<CustomHttpResponse<Tran2Domain[]>>(`${this.apiUrl}/${RoutePathEnum.TRAN2_GET_QUERY_PATH}`, data);
  }

  addTran2(data: Tran2Domain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.TRAN2_ADD_PATH}`, data);
  }

  updateTran2(currentName: string, data: Tran2Domain) {
    const params = new HttpParams()
      .set('currentTran2Name', currentName)
      .append('tran2Name', data.tran2Name)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.TRAN2_UPDATE_PATH}`, '', {params});
  }

  deleteTran2(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.TRAN2_DELETE_PATH}/${id}`);
  }

  onFetchTran2() {
    this.tran2Dispatcher._Tran2Get()
  }

  onFetchTran2Query(data: any) {
    this.tran2Dispatcher._Tran2GetQuery(data)
  }

  onAddTran2(data: Tran2Domain) {
    this.tran2Dispatcher._Tran2Add(data)
  }

  onUpdateTran2(currentName: string, data: Tran2Domain) {
    this.tran2Dispatcher._Tran2Update(currentName, data)
  }

  onDeleteTran2(id: number) {
    this.tran2Dispatcher._Tran2Delete(id)
  }

}
