import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserDispatcher} from "../state/user.dispatcher";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {UserDomain} from "../domain/user.domain";
import {StateContext} from "@ngxs/store";
import {UserStateModel} from "../state/user.state";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private userDispatcher: UserDispatcher
  ) { }

  getUser() {
    return this.http.get<CustomHttpResponse<UserDomain[]>>(`${this.apiUrl}/${RoutePathEnum.USER_GET_PATH}`);
  }

  getUserQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.USER_GET_QUERY_PATH}`, data);
  }

  getUserForward(username: string) {
    return this.http.get<CustomHttpResponse<UserDomain[]>>(`${this.apiUrl}/${RoutePathEnum.USER_GET_FORWARD_PATH}/${username}`);
  }

  addUser(payload: UserDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.USER_ADD_PATH}`, payload)
  }

  updateUser(currentName: string, payload: UserDomain) {
    const params = new HttpParams().set('currentUsername', currentName)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.USER_UPDATE_PATH}`, payload, {params})
  }

  deleteUser(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.USER_DELETE_PATH}/${id}`
    );
  }

  resetPassword(username: string, data: any) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.USER_RESET_PASS_PATH}/${username}`, data)
  }

  onGetUser() {
    this.userDispatcher._UserGet()
  }

  onGetUserQuery(data: any) {
    this.userDispatcher._UserGetQuery(data);
  } 

  onAddUser(data: UserDomain) {
    this.userDispatcher._UserAdd(data)
  }

  onUpdateUser(currentName: string, data: UserDomain) {
    this.userDispatcher._UserUpdate(currentName, data)
  }

  onDeleteUser(id: number) {
    this.userDispatcher._UserDelete(id)
  }

  onResetPassword(username: string, data: any) {
    this.userDispatcher._UserResetPassword(username, data)
  }

  onGetAllInformation(action: (ctx: StateContext<UserStateModel>) => void) {
    this.userDispatcher._UserGetAllInformation(action)
  }
}
