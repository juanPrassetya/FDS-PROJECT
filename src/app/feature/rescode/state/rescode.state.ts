import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { RescodeDomain } from "../domain/rescode.domain";
import { RescodeService } from "../service/rescode.service";
import {RescodeAdd, RescodeDelete, RescodeGet, RescodeGetQuery, RescodeUpdate} from "./rescode.actions";

export class RescodeStateModel {
  data: RescodeDomain[] = [];
}

@State<RescodeStateModel>({
  name: 'rescodeState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class RescodeState {

  constructor(
    private rescodeService: RescodeService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: RescodeStateModel) {
    return state.data
  }

  @Action(RescodeGet, {cancelUncompleted: true})
  getData(ctx: StateContext<RescodeStateModel>) {
    return this.rescodeService.getRescode().pipe(
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

  @Action(RescodeGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<RescodeStateModel>, {data}: RescodeGetQuery) {
    return this.rescodeService.getRescodeQuery(data).pipe(
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

  @Action(RescodeAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<RescodeStateModel>, {data}: RescodeAdd) {
    return this.rescodeService.addRescode(data).pipe(
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

  @Action(RescodeUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<RescodeStateModel>, {currentName, data}: RescodeUpdate) {
    return this.rescodeService.updateRescode(currentName, data).pipe(
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

  @Action(RescodeDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<RescodeStateModel>, {id}: RescodeDelete) {
    return this.rescodeService.deleteRescode(id).pipe(
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
