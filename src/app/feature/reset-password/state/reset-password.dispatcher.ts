import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ResetPassword} from "./reset-password.actions";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordDispatcher {

  @Dispatch()
  public _ResetPassword(username: string, data: {currentPass: string, newPass: string}) {
    return new ResetPassword(username, data)
  }
}
