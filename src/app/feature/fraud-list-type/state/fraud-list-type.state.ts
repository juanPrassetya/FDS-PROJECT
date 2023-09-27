import {FraudListTypeDomain} from "../domain/fraud-list-type.domain";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {FraudListGet} from "../../fraud-list/state/fraud-list.actions";
import {tap} from "rxjs";
import {FraudListTypeService} from "../service/fraud-list-type.service";

export class FraudListTypeStateModel {
  data: FraudListTypeDomain[] = [];
}

@State<FraudListTypeStateModel>({
  name: 'fraudListTypeState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class FraudListTypeState {
  constructor(
    private fraudListTypeService: FraudListTypeService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: FraudListTypeStateModel) {
    return state.data
  }

  @Action(FraudListGet, {cancelUncompleted: true})
  getData(ctx: StateContext<FraudListTypeStateModel>) {
    return this.fraudListTypeService.getFraudListType().pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            data: response.responseData
          })
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }
}
