import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {UserGroupAdd, UserGroupDelete, UserGroupGet, UserGroupGetQuery, UserGroupUpdate} from "./user-group.actions";
import {UserGroupDomain} from "../domain/user-group.domain";

@Injectable({
  providedIn: 'root'
})
export class UserGroupDispatcher {

  @Dispatch()
  public _FetchAllUserGroup() {
    return new UserGroupGet();
  }

  @Dispatch()
  public _FetchAllUserGroupQuery(data: any) {
    return new UserGroupGetQuery(data);
  }

  @Dispatch()
  public _UserGroupAdd(data: UserGroupDomain) {
    return new UserGroupAdd(data)
  }

  @Dispatch()
  public _UserGroupUpdate(currentName: string, data: UserGroupDomain) {
    return new UserGroupUpdate(currentName, data)
  }

  @Dispatch()
  public _UserGroupDelete(id: number) {
    return new UserGroupDelete(id)
  }
}
