import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {OperationGet, UserRoleAdd, UserRoleDelete, UserRoleGet, UserRoleGetQuery, UserRoleUpdate} from "./user-role.actions";
import {UserRoleDomain} from "../domain/user-role.domain";

@Injectable({
  providedIn: 'root'
})
export class UserRoleDispatcher {

  @Dispatch()
  public _UserRoleGet() {
    return new UserRoleGet()
  }

  @Dispatch()
  public _UserRoleGetQuery(data: any) {
    return new UserRoleGetQuery(data)
  }

  @Dispatch()
  public _OperationGet() {
    return new OperationGet()
  }

  @Dispatch()
  public _UserRoleAdd(data: UserRoleDomain) {
    return new UserRoleAdd(data)
  }

  @Dispatch()
  public _UserRoleUpdate(currentName: string, data: UserRoleDomain) {
    return new UserRoleUpdate(currentName, data)
  }

  @Dispatch()
  public _UserRoleDelete(id: number) {
    return new UserRoleDelete(id)
  }
}
