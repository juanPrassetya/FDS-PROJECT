import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {FraudReactionsDomain} from "../domain/fraud-reactions.domain";
import {NotificationService} from "../../../shared/services/notification.service";
import {FraudReactionsService} from "../service/fraud-reactions.service";
import {tap} from "rxjs";
import {
  FraudReactionsAdd,
  FraudReactionsDelete,
  FraudReactionsGet,
  FraudReactionsGetAllInformation,
  FraudReactionsGetByBindingIdAndType,
  FraudReactionsGetQuery,
  FraudReactionsResetState,
  FraudReactionsUpdate
} from "./fraud-reactions.actions";

export class FraudReactionStateModel {
  data: FraudReactionsDomain[] = [];
  dataByBinding: FraudReactionsDomain[] = [];
}

@State<FraudReactionStateModel>({
  name: 'fraudReactionsState',
  defaults: {
    data: [],
    dataByBinding: []
  }
})

@Injectable()
export class FraudReactionsState {

  constructor(
    private fraudReactionsService: FraudReactionsService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: FraudReactionStateModel) {
    return state.data
  }

  @Selector()
  static dataByBinding(state: FraudReactionStateModel) {
    return state.dataByBinding
  }

  @Action(FraudReactionsGet, {cancelUncompleted: true})
  getData(ctx: StateContext<FraudReactionStateModel>) {
    return this.fraudReactionsService.getFraudReactions().pipe(
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

  @Action(FraudReactionsGetQuery, {cancelUncompleted: true})
  getDataByQuery(ctx: StateContext<FraudReactionStateModel>, {data}: FraudReactionsGetQuery) {
    return this.fraudReactionsService.getFraudReactionsQuery(data).pipe(
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

  @Action(FraudReactionsGetByBindingIdAndType, {cancelUncompleted: true})
  getDataByBinding(ctx: StateContext<FraudReactionStateModel>, {id, type}: FraudReactionsGetByBindingIdAndType) {
    return this.fraudReactionsService.getFraudReactionsByBindingIdAndType(id, type).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            dataByBinding: response.responseData,
          })
        },
        error => {
          if (error.status != 401 && error.status != 404) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(FraudReactionsAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<FraudReactionStateModel>, {data}: FraudReactionsAdd) {
    return this.fraudReactionsService.addFraudReactions(data).pipe(
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

  @Action(FraudReactionsUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<FraudReactionStateModel>, {data}: FraudReactionsUpdate) {
    return this.fraudReactionsService.updateFraudReactions(data).pipe(
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

  @Action(FraudReactionsDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<FraudReactionStateModel>, {id}: FraudReactionsDelete) {
    return this.fraudReactionsService.deleteFraudReactions(id).pipe(
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

  @Action(FraudReactionsGetAllInformation, {cancelUncompleted: true})
  getAllInformation(ctx: StateContext<FraudReactionStateModel>, {action}: FraudReactionsGetAllInformation) {
    action(ctx)
  }

  @Action(FraudReactionsResetState, {cancelUncompleted: true})
  resetState(ctx: StateContext<FraudReactionStateModel>, {action}: FraudReactionsResetState) {
    action(ctx)
  }
}
