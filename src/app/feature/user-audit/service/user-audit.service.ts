import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {UserAuditDomain} from "../domain/user-audit.domain";
import {UserAuditDispatcher} from "../state/user-audit.dispatcher";
import { UserAuditStateModel } from '../state/user-audit.state';
import { StateContext } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class UserAuditService  {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private userAuditDispatcher: UserAuditDispatcher
  ) { }

  getUserAudit() {
    return this.http.get<CustomHttpResponse<UserAuditDomain[]>>(`${this.apiUrl}/${RoutePathEnum.AUDIT_GET_PATH}`);
  }

  getUserAuditQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.AUDIT_GET_QUERY_PATH}`, data);
  }

  onFetchUserAudit() {
    this.userAuditDispatcher._UserAuditGet()
  }

  onFetchUserAuditQuery(data: any) {
    this.userAuditDispatcher._UserAuditGetQuery(data)
  }

  onGetAllInformation(action: (ctx: StateContext<UserAuditStateModel>) => void) {
    this.userAuditDispatcher._UserAuditGetAllInformation(action)
  }
}
