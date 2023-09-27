import {TriggeredRuleDomain} from "../../../../feature/transaction/domain/triggered-rule.domain";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {TransactionService} from "../../../../feature/transaction/service/transaction.service";
import {NotificationService} from "../../../services/notification.service";
import {UserNotificationDomain} from "../domain/user-notification.domain";
import {HeaderService} from "../service/header.service";
import {TransactionGet} from "../../../../feature/transaction/state/transaction.actions";
import {tap} from "rxjs";
import {TransactionStateModel} from "../../../../feature/transaction/state/transaction.state";
import {UserNotificationGet} from "./header.actions";

export class HeaderStateModel {
  userNotifs: Array<UserNotificationDomain> = []
}

@State<HeaderStateModel>({
  name: 'headerState',
  defaults: {
    userNotifs: []
  }
})

@Injectable()
export class HeaderState {

  constructor(
    private headerService: HeaderService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static userNotifs(state: HeaderStateModel) {
    return state.userNotifs;
  }

  @Action(UserNotificationGet, {cancelUncompleted: true})
  getData(ctx: StateContext<HeaderStateModel>, {userId}: UserNotificationGet) {
    return this.headerService.fetchUserNotification(userId).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          userNotifs: response.responseData,
        })
      })
    )
  }
}
