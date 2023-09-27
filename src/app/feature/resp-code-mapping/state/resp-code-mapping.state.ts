import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {RespCodeMappingDomain} from "../domain/resp-code-mapping.domain";
import {RespCodeMappingService} from "../service/resp-code-mapping.service";
import {tap} from "rxjs";
import {RespCodeMappingGet} from "./resp-code-mapping.actions";

export class RespCodeStateModel {
  data: RespCodeMappingDomain[] = [];
}

@State<RespCodeStateModel>({
  name: 'respCodeMappingState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class RespCodeMappingState {

  constructor(
    private respCodeMappingService: RespCodeMappingService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: RespCodeStateModel) {
    return state.data
  }

  @Action(RespCodeMappingGet, {cancelUncompleted: true})
  getData(ctx: StateContext<RespCodeStateModel>) {
    return this.respCodeMappingService.getRespCodeMapping().pipe(
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
}
