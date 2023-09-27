import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {
  FraudListValueAdd,
  FraudListValueDelete,
  FraudListValueGetById,
  FraudListValueResetAllInformation,
  FraudListValueUpdate,
  FraudListValueUpload
} from "./fraud-list-value.actions";
import {tap} from "rxjs";
import {FraudListValueService} from "../service/fraud-list-value.service";
import {FraudListValueDomain} from "../domain/fraud-list-value.domain";

export class FraudListValueStateModel {
  items: FraudListValueDomain[] = [];
  item: FraudListValueDomain | undefined
}

@State<FraudListValueStateModel>({
  name: 'fraudListValueState',
  defaults: {
    items: [],
    item: undefined
  }
})

@Injectable()
export class FraudListValueState {

  constructor(
    private fraudListValueService: FraudListValueService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static items(state: FraudListValueStateModel) {
    return state.items
  }

  @Action(FraudListValueGetById, {cancelUncompleted: true})
  getDataById(ctx: StateContext<FraudListValueStateModel>, {id}: FraudListValueGetById) {
    return this.fraudListValueService.getFraudListValueById(id).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            items: response.responseData
          })
        },

        error => {
          if (error.status == 404){
            ctx.setState({
              ...ctx.getState(),
              items: []
            })
          } else this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(FraudListValueAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<FraudListValueStateModel>, {data}: FraudListValueAdd) {
    return this.fraudListValueService.addFraudListValue(data).pipe(
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

  @Action(FraudListValueUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<FraudListValueStateModel>, {currentValue, data}: FraudListValueUpdate) {
    return this.fraudListValueService.updateFraudListValue(currentValue, data).pipe(
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

  @Action(FraudListValueDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<FraudListValueStateModel>, {id}: FraudListValueDelete) {
    return this.fraudListValueService.deleteFraudListValue(id).pipe(
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

  @Action(FraudListValueUpload, {cancelUncompleted: true})
  uploadData(ctx: StateContext<FraudListValueStateModel>, {data}: FraudListValueUpload) {
    return this.fraudListValueService.upload(data).pipe(
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

  @Action(FraudListValueResetAllInformation, {cancelUncompleted: true})
  resetAllInformation(ctx: StateContext<FraudListValueStateModel>, {action}: FraudListValueResetAllInformation) {
    action(ctx)
  }
}
