import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {ResetPasswordService} from "../service/reset-password.service";
import {ResetPassword} from "./reset-password.actions";
import {tap} from "rxjs";
import {NotificationService} from "../../../shared/services/notification.service";

export class ResetPasswordStateModel {
  isPasswordReset: boolean = false
}

@State<ResetPasswordStateModel>({
  name: 'resetPasswordState',
  defaults: {
    isPasswordReset: false
  }
})

@Injectable()
export class ResetPasswordState {

  constructor(
    private resetPasswordService: ResetPasswordService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static isPasswordReset(state: ResetPasswordStateModel) {
    return state.isPasswordReset;
  }

  @Action(ResetPassword, {cancelUncompleted: true})
  resetPassword(ctx: StateContext<ResetPasswordStateModel>, {username, data}: ResetPassword) {
    return this.resetPasswordService.resetPassword(username, data).pipe(
        tap(
          response => {
            this.notificationService.successNotification('Reset Password', response.responseMessage)
            ctx.setState({
              ...ctx.getState(),
              isPasswordReset: true
            })
          },

          error => {
            if (error.status != 401) this.notificationService.errorHttpNotification(error)
          }
        )
      )
  }
}
