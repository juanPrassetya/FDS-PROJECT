import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {UserGroupDomain} from "../domain/user-group.domain";
import {UserGroupDispatcher} from "../state/user-group.dispatcher";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {InstitutionDomain} from "../../institution/domain/institution.domain";

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private userGroupDispatcher: UserGroupDispatcher
  ) {
  }
  fetchAllUserGroup() {
    return this.http.get<CustomHttpResponse<Array<UserGroupDomain>>>(`${this.apiUrl}/${RoutePathEnum.GROUP_GET_PATH}`);
  }

  fetchAllUserGroupQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.GROUP_GET_QUERY_PATH}`, data);
  }

  addUserGroup(data: UserGroupDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.GROUP_ADD_PATH}`, data);
  }

  updateUserGroup(currentName: string, data: UserGroupDomain) {
    const params = new HttpParams()
      .set('currentGroupName', currentName)
      .append('groupName', data.groupName)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.GROUP_UPDATE_PATH}`, '', {params});
  }

  deleteUserGroup(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.GROUP_DELETE_PATH}/${id}`);
  }

  onFetchAllUserGroup() {
    this.userGroupDispatcher._FetchAllUserGroup()
  }

  onFetchAllUserGroupQuery(data: any) {
    this.userGroupDispatcher._FetchAllUserGroupQuery(data)
  }

  onAddUserGroup(data: UserGroupDomain) {
    this.userGroupDispatcher._UserGroupAdd(data)
  }

  onUpdateUserGroup(currentName: string, data: UserGroupDomain) {
    this.userGroupDispatcher._UserGroupUpdate(currentName, data)
  }

  onDeleteUserGroup(id: number) {
    this.userGroupDispatcher._UserGroupDelete(id)
  }
}
