import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {BlackListDomain} from "../domain/black-list.domain";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import {BlackListService} from "../service/black-list.service";
import {
  BlackListAdd,
  BlackListDelete,
  BlackListGet,
  BlackListGetAllInformation,
  BlackListGetQuery,
  BlackListUpdate, BlackListUpload
} from "./black-list.actions";
import {WhiteListUpload} from "../../white-list/state/white-list.actions";
import {WhiteListStateModel} from "../../white-list/state/white-list.state";

export class BlackListStateModel {
  data: BlackListDomain[] = [];
}

@State<BlackListStateModel>({
  name: 'blackListState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class BlackListState {

  constructor(
    private blackListService: BlackListService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: BlackListStateModel) {
    return state.data
  }

  @Action(BlackListGet, {cancelUncompleted: true})
  getData(ctx: StateContext<BlackListStateModel>) {
    return this.blackListService.getBlackList().pipe(
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

  @Action(BlackListGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<BlackListStateModel>, {data}: BlackListGetQuery) {
    return this.blackListService.getBlackListQuery(data).pipe(
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

  @Action(BlackListAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<BlackListStateModel>, {data}: BlackListAdd) {
    return this.blackListService.addBlackList(data).pipe(
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

  @Action(BlackListUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<BlackListStateModel>, {currentId, data}: BlackListUpdate) {
    return this.blackListService.updateBlackList(currentId, data).pipe(
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

  @Action(BlackListDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<BlackListStateModel>, {id}: BlackListDelete) {
    return this.blackListService.deleteBlackList(id).pipe(
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

  @Action(BlackListUpload, {cancelUncompleted: true})
  uploadData(ctx: StateContext<BlackListStateModel>, {data}: BlackListUpload) {
    return this.blackListService.upload(data).pipe(
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

  @Action(BlackListGetAllInformation, {cancelUncompleted: true})
  getAllInformation(ctx: StateContext<BlackListStateModel>, {action}: BlackListGetAllInformation) {
    action(ctx)
  }
}
