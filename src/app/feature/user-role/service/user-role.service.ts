import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {UserRoleDomain} from "../domain/user-role.domain";
import {UserRoleDispatcher} from "../state/user-role.dispatcher";
import {OperationDomain} from "../domain/operation.domain";

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private userRoleDispatcher: UserRoleDispatcher
  ) { }

  getUserRole() {
    return this.http.get<CustomHttpResponse<UserRoleDomain[]>>(`${this.apiUrl}/${RoutePathEnum.ROLE_GET_PATH}`);
  }

  getUserRoleQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.ROLE_GET_QUERY_PATH}`, data);
  }

  getOperation() {
    return this.http.get<CustomHttpResponse<OperationDomain[]>>(`${this.apiUrl}/${RoutePathEnum.OPERATION_GET_PATH}`);
  }

  addUserRole(data: UserRoleDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ROLE_ADD_PATH}`, data);
  }

  updateUserRole(currentName: string, data: UserRoleDomain) {
    const params = new HttpParams().set('currentRoleName', currentName)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ROLE_UPDATE_PATH}`, data, {params});
  }

  deleteUserRole(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.ROLE_DELETE_PATH}/${id}`);
  }

  onFetchUserRole() {
    this.userRoleDispatcher._UserRoleGet()
  }

  onFetchUserRoleQuery(data: any) {
    this.userRoleDispatcher._UserRoleGetQuery(data)
  }

  onFetchOperation() {
    this.userRoleDispatcher._OperationGet()
  }

  onAddUserRole(data: UserRoleDomain) {
    this.userRoleDispatcher._UserRoleAdd(data)
  }

  onUpdateUserRole(currentName: string, data: UserRoleDomain) {
    this.userRoleDispatcher._UserRoleUpdate(currentName, data)
  }

  onDeleteUserRole(id: number) {
    this.userRoleDispatcher._UserRoleDelete(id)
  }

}

