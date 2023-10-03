import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { PanDomain } from '../domain/pan.component';
import { PanDispatcher } from '../state/pan.dispatcher';

@Injectable({
  providedIn: 'root'
})
export class PanService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private panDispatcher: PanDispatcher
  ) { }

  getPan() {
    return this.http.get<CustomHttpResponse<PanDomain[]>>(`${this.apiUrl}/${RoutePathEnum.PAN_GET_PATH}`);
  }

  getPanQuery(data: any) {
    return this.http.post<CustomHttpResponse<PanDomain[]>>(`${this.apiUrl}/${RoutePathEnum.PAN_GET_QUERY_PATH}`, data);
  }

  addPan(data: PanDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.PAN_ADD_PATH}`, data);
  }

  updatePan(currentName: string, data: PanDomain) {
    const params = new HttpParams()
      .set('currentPanName', currentName)
      .append('panName', data.panName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.PAN_UPDATE_PATH}`, '', {params});
  }

  deletePan(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.PAN_DELETE_PATH}/${id}`);
  }

  onFetchPan() {
    this.panDispatcher._PanGet()
  }

  onFetchPanQuery(data: any) {
    this.panDispatcher._PanGetQuery(data)
  }

  onAddPan(data: PanDomain) {
    this.panDispatcher._PanAdd(data)
  }

  onUpdatePan(currentName: string, data: PanDomain) {
    this.panDispatcher._PanUpdate(currentName, data)
  }

  onDeletePan(id: number) {
    this.panDispatcher._PanDelete(id)
  }

}
