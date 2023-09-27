import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {ResetPasswordDispatcher} from "../state/reset-password.dispatcher";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private resetPasswordDispatcher: ResetPasswordDispatcher
  ) { }

  resetPassword(username: string, data: { currentPass: string, newPass: string }) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/user/resetpassword/${username}`, data)
  }

  onResetPassword(username: string, data: { currentPass: string, newPass: string }) {
    this.resetPasswordDispatcher._ResetPassword(
      username,
      data
    )
  }
}
