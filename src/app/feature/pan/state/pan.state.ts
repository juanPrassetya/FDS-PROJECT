import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { PanDomain } from "../domain/pan.component";
import { PanService } from "../service/pan.service";
import {PanAdd, PanDelete, PanGet, PanGetQuery, PanUpdate} from "./pan.actions";

export class PanStateModel {
  data: PanDomain[] = [];
}

@State<PanStateModel>({
  name: 'panState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class PanState {

  constructor(
    private panService: PanService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: PanStateModel) {
    return state.data
  }

  @Action(PanGet, {cancelUncompleted: true})
  getData(ctx: StateContext<PanStateModel>) {
    return this.panService.getPan().pipe(
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

  @Action(PanGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<PanStateModel>, {data}: PanGetQuery) {
    return this.panService.getPanQuery(data).pipe(
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

  @Action(PanAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<PanStateModel>, {data}: PanAdd) {
    return this.panService.addPan(data).pipe(
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

  @Action(PanUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<PanStateModel>, {currentName, data}: PanUpdate) {
    return this.panService.updatePan(currentName, data).pipe(
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

  @Action(PanDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<PanStateModel>, {id}: PanDelete) {
    return this.panService.deletePan(id).pipe(
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
