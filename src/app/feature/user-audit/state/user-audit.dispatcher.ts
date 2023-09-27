import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {UserAuditGet, UserAuditGetAllInformation, UserAuditGetQuery} from "./user-audit.actions";
import { StateContext } from "@ngxs/store";
import { UserAuditStateModel } from "./user-audit.state";

@Injectable({
  providedIn: 'root'
})
export class UserAuditDispatcher {

  @Dispatch()
  public _UserAuditGet() {
    return new UserAuditGet()
  }

  @Dispatch()
  public _UserAuditGetQuery(data: any) {
    return new UserAuditGetQuery(data)
  }

  @Dispatch()
  public _UserAuditGetAllInformation(action: (ctx: StateContext<UserAuditStateModel>) => void) {
    return new UserAuditGetAllInformation(action)
  }
}
