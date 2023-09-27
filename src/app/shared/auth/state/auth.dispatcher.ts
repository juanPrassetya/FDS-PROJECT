import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {AuthGetUserData, AuthLogin, AuthLogout, AuthTokenRefresh} from "./auth.actions";

@Injectable({
  providedIn: 'root'
})
export class AuthDispatcher {

  @Dispatch()
  public _AuthLogin(username: string, password: string) {
    return new AuthLogin(username, password)
  }

  @Dispatch()
  public _AuthLogout() {
    return new AuthLogout()
  }

  @Dispatch()
  public _AuthGetUserData() {
    return new AuthGetUserData()
  }

  @Dispatch()
  public _AuthTokenRefresh() {
    return new AuthTokenRefresh()
  }
}
