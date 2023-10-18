import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { ActionDomain } from "../domain/action.component";
import { ActionService } from "../service/action.service";
import {ActionAdd, ActionDelete, ActionGet, ActionGetQuery, ActionUpdate} from "./action.actions";

export class ActionStateModel {
  data: ActionDomain[] = [];
}

@State<ActionStateModel>({
  name: 'actionState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class ActionState {

  constructor(
    private actionService: ActionService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: ActionStateModel) {
    return state.data
  }

  @Action(ActionGet, {cancelUncompleted: true})
  getData(ctx: StateContext<ActionStateModel>) {
    return this.actionService.getAction().pipe(
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

  @Action(ActionGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<ActionStateModel>, {data}: ActionGetQuery) {
    return this.actionService.getActionQuery(data).pipe(
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

  @Action(ActionAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<ActionStateModel>, {data}: ActionAdd) {
    return this.actionService.addAction(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ActionUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<ActionStateModel>, {currentName, data}: ActionUpdate) {
    return this.actionService.updateAction(currentName, data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ActionDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<ActionStateModel>, {id}: ActionDelete) {
    return this.actionService.deleteAction(id).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }
}
