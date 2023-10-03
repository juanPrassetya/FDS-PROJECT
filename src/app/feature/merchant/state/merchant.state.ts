import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import {MerchantDomain} from "../domain/merchant.domain";
import {MerchantService} from "../service/merchant.service";
import {MerchantAdd, MerchantDelete, MerchantGet, MerchantGetQuery, MerchantUpdate} from "./merchant.actions";

export class MerchantStateModel {
  data: MerchantDomain[] = [];
}

@State<MerchantStateModel>({
  name: 'merchantState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class MerchantState {

  constructor(
    private merchantService: MerchantService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: MerchantStateModel) {
    return state.data
  }

  @Action(MerchantGet, {cancelUncompleted: true})
  getData(ctx: StateContext<MerchantStateModel>) {
    return this.merchantService.getMerchant().pipe(
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

  @Action(MerchantGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<MerchantStateModel>, {data}: MerchantGetQuery) {
    return this.merchantService.getMerchantQuery(data).pipe(
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

  @Action(MerchantAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<MerchantStateModel>, {data}: MerchantAdd) {
    return this.merchantService.addMerchant(data).pipe(
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

  @Action(MerchantUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<MerchantStateModel>, {currentName, data}: MerchantUpdate) {
    return this.merchantService.updateMerchant(currentName, data).pipe(
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

  @Action(MerchantDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<MerchantStateModel>, {id}: MerchantDelete) {
    return this.merchantService.deleteMerchant(id).pipe(
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
