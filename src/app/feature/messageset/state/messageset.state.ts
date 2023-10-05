import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { MessagesetDomain } from "../domain/messageset.component";
import { MessagesetService } from "../service/messageset.service";
import {MessagesetAdd, MessagesetDelete, MessagesetGet, MessagesetGetQuery, MessagesetUpdate} from "./messageset.actions";

export class MessagesetStateModel {
  data: MessagesetDomain[] = [];
}

@State<MessagesetStateModel>({
  name: 'messagesetState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class MessagesetState {

  constructor(
    private messagesetService: MessagesetService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: MessagesetStateModel) {
    return state.data
  }

  @Action(MessagesetGet, {cancelUncompleted: true})
  getData(ctx: StateContext<MessagesetStateModel>) {
    return this.messagesetService.getMessageset().pipe(
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

  @Action(MessagesetGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<MessagesetStateModel>, {data}: MessagesetGetQuery) {
    return this.messagesetService.getMessagesetQuery(data).pipe(
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

  @Action(MessagesetAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<MessagesetStateModel>, {data}: MessagesetAdd) {
    return this.messagesetService.addMessageset(data).pipe(
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

  @Action(MessagesetUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<MessagesetStateModel>, {currentName, data}: MessagesetUpdate) {
    return this.messagesetService.updateMessageset(currentName, data).pipe(
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

  @Action(MessagesetDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<MessagesetStateModel>, {id}: MessagesetDelete) {
    return this.messagesetService.deleteMessageset(id).pipe(
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
