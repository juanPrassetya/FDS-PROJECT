import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { ManagementDomain } from '../domain/management.domain';
import { ManagementDispatcher } from '../state/management.dispatcher';
@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private managementDispatcher: ManagementDispatcher
  ) { }

  getManagement() {
    return this.http.get<CustomHttpResponse<ManagementDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MANAGEMENT_GET_PATH}`);
  }

  getManagementQuery(data: any) {
    return this.http.post<CustomHttpResponse<ManagementDomain[]>>(`${this.apiUrl}/${RoutePathEnum.MANAGEMENT_GET_QUERY_PATH}`, data);
  }

  addManagement(data: ManagementDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MANAGEMENT_ADD_PATH}`, data);
  }

  updateManagement(currentName: string, data: ManagementDomain) {
    const params = new HttpParams()
      .set('currentManagementName', currentName)
      .append('managementName', data.managementName)
      .append('description', data.description)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MANAGEMENT_UPDATE_PATH}`, '', {params});
  }

  deleteManagement(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.MANAGEMENT_DELETE_PATH}/${id}`);
  }

  onFetchManagement() {
    this.managementDispatcher._ManagementGet()
  }

  onFetchManagementQuery(data: any) {
    this.managementDispatcher._ManagementGetQuery(data)
  }

  onAddManagement(data: ManagementDomain) {
    this.managementDispatcher._ManagementAdd(data)
  }

  onUpdateManagement(currentName: string, data: ManagementDomain) {
    this.managementDispatcher._ManagementUpdate(currentName, data)
  }

  onDeleteManagement(id: number) {
    this.managementDispatcher._ManagementDelete(id)
  }

}
