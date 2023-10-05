import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import {ConnectsetDomain} from "../domain/connectset.domain";
import {ConnectsetService} from "../service/connectset.service";
import {ConnectsetAdd, ConnectsetDelete, ConnectsetGet, ConnectsetGetQuery, ConnectsetUpdate} from "./connectset.actions";

export class ConnectsetStateModel {
  data: ConnectsetDomain[] = [];
}

@State<ConnectsetStateModel>({
  name: 'connectsetState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class ConnectsetState {

  constructor(
    private connectsetService: ConnectsetService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: ConnectsetStateModel) {
    return state.data
  }

  @Action(ConnectsetGet, {cancelUncompleted: true})
  getData(ctx: StateContext<ConnectsetStateModel>) {
    return this.connectsetService.getConnectset().pipe(
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

  @Action(ConnectsetGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<ConnectsetStateModel>, {data}: ConnectsetGetQuery) {
    return this.connectsetService.getConnectsetQuery(data).pipe(
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

  @Action(ConnectsetAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<ConnectsetStateModel>, {data}: ConnectsetAdd) {
    return this.connectsetService.addConnectset(data).pipe(
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

  @Action(ConnectsetUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<ConnectsetStateModel>, {currentName, data}: ConnectsetUpdate) {
    return this.connectsetService.updateConnectset(currentName, data).pipe(
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

  @Action(ConnectsetDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<ConnectsetStateModel>, {id}: ConnectsetDelete) {
    return this.connectsetService.deleteConnectset(id).pipe(
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
