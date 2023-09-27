import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotifTypeDomain} from "../domain/notif-type.domain";
import {NotificationService} from "../../../shared/services/notification.service";
import {BlackListGet} from "../../black-list/state/black-list.actions";
import {tap} from "rxjs";
import {NotifTypeService} from "../service/notif-type.service";
import {NotificationTypeGet} from "./notif-type.actions";

export class NotifTypeStateModel {
  data: NotifTypeDomain[] = [];
}

@State<NotifTypeStateModel>({
  name: 'notificationTypeState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class NotifTypeState {

  constructor(
    private notifTypeService: NotifTypeService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: NotifTypeStateModel) {
    return state.data
  }

  @Action(NotificationTypeGet, {cancelUncompleted: true})
  getData(ctx: StateContext<NotifTypeStateModel>) {
    return this.notifTypeService.getNotificationType().pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            data: response.responseData,
          })
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }
}
