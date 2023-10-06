import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { Tran2Domain } from "../domain/tran2.component";
import { Tran2Service } from "../service/tran2.service";
import {Tran2Add, Tran2Delete, Tran2Get, Tran2GetQuery, Tran2Update} from "./tran2.actions";

export class Tran2StateModel {
  data: Tran2Domain[] = [];
}

@State<Tran2StateModel>({
  name: 'tran2State',
  defaults: {
    data: [],
  }
})

@Injectable()
export class Tran2State {

  constructor(
    private tran2Service: Tran2Service,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: Tran2StateModel) {
    return state.data
  }

  @Action(Tran2Get, {cancelUncompleted: true})
  getData(ctx: StateContext<Tran2StateModel>) {
    return this.tran2Service.getTran2().pipe(
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

  @Action(Tran2GetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<Tran2StateModel>, {data}: Tran2GetQuery) {
    return this.tran2Service.getTran2Query(data).pipe(
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

  @Action(Tran2Add, {cancelUncompleted: true})
  addData(ctx: StateContext<Tran2StateModel>, {data}: Tran2Add) {
    return this.tran2Service.addTran2(data).pipe(
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

  @Action(Tran2Update, {cancelUncompleted: true})
  updateData(ctx: StateContext<Tran2StateModel>, {currentName, data}: Tran2Update) {
    return this.tran2Service.updateTran2(currentName, data).pipe(
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

  @Action(Tran2Delete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<Tran2StateModel>, {id}: Tran2Delete) {
    return this.tran2Service.deleteTran2(id).pipe(
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
