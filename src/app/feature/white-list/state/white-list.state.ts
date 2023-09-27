import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {WhiteListDomain} from "../domain/white-list.domain";
import {WhiteListService} from "../service/white-list.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {
  WhiteListAdd,
  WhiteListDelete,
  WhiteListGet,
  WhiteListGetAllInformation,
  WhiteListGetQuery,
  WhiteListUpdate, WhiteListUpload
} from "./white-list.actions";
import {tap} from "rxjs";

export class WhiteListStateModel {
  data: WhiteListDomain[] = [];
}

@State<WhiteListStateModel>({
  name: 'whiteListState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class WhiteListState {

  constructor(
    private whiteListService: WhiteListService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: WhiteListStateModel) {
    return state.data
  }

  @Action(WhiteListGet, {cancelUncompleted: true})
  getData(ctx: StateContext<WhiteListStateModel>) {
    return this.whiteListService.getWhiteList().pipe(
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

  @Action(WhiteListGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<WhiteListStateModel>, {data}: WhiteListGetQuery) {
    return this.whiteListService.getWhiteListQuery(data).pipe(
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

  @Action(WhiteListAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<WhiteListStateModel>, {data}: WhiteListAdd) {
    return this.whiteListService.addWhiteList(data).pipe(
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

  @Action(WhiteListUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<WhiteListStateModel>, {currentId, data}: WhiteListUpdate) {
    return this.whiteListService.updateWhiteList(currentId, data).pipe(
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

  @Action(WhiteListDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<WhiteListStateModel>, {id}: WhiteListDelete) {
    return this.whiteListService.deleteWhiteList(id).pipe(
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

  @Action(WhiteListUpload, {cancelUncompleted: true})
  uploadData(ctx: StateContext<WhiteListStateModel>, {data}: WhiteListUpload) {
    return this.whiteListService.upload(data).pipe(
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

  @Action(WhiteListGetAllInformation, {cancelUncompleted: true})
  getAllInformation(ctx: StateContext<WhiteListStateModel>, {action}: WhiteListGetAllInformation) {
    action(ctx)
  }
}
