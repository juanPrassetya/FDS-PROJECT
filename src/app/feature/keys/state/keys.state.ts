import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { KeysDomain } from "../domain/keys.component";
import { KeysService } from "../service/keys.service";
import {KeysAdd, KeysDelete, KeysGet, KeysGetQuery, KeysUpdate} from "./keys.actions";

export class KeysStateModel {
  data: KeysDomain[] = [];
}

@State<KeysStateModel>({
  name: 'keysState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class KeysState {

  constructor(
    private keysService: KeysService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: KeysStateModel) {
    return state.data
  }

  @Action(KeysGet, {cancelUncompleted: true})
  getData(ctx: StateContext<KeysStateModel>) {
    return this.keysService.getKeys().pipe(
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

  @Action(KeysGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<KeysStateModel>, {data}: KeysGetQuery) {
    return this.keysService.getKeysQuery(data).pipe(
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

  @Action(KeysAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<KeysStateModel>, {data}: KeysAdd) {
    return this.keysService.addKeys(data).pipe(
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

  @Action(KeysUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<KeysStateModel>, {currentName, data}: KeysUpdate) {
    return this.keysService.updateKeys(currentName, data).pipe(
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

  @Action(KeysDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<KeysStateModel>, {id}: KeysDelete) {
    return this.keysService.deleteKeys(id).pipe(
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
