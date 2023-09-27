import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import {UserAuditGet, UserAuditGetAllInformation, UserAuditGetQuery} from "./user-audit.actions";
import {UserAuditDomain} from "../domain/user-audit.domain";
import {UserAuditService} from "../service/user-audit.service";

export class UserAuditStateModel {
  data: UserAuditDomain[] = [];
}

@State<UserAuditStateModel>({
  name: 'userAuditState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class UserAuditState {

  constructor(
    private institutionService: UserAuditService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: UserAuditStateModel) {
    return state.data
  }

  @Action(UserAuditGet, {cancelUncompleted: true})
  getData(ctx: StateContext<UserAuditStateModel>) {
    return this.institutionService.getUserAudit().pipe(
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

  @Action(UserAuditGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<UserAuditStateModel>, {data}: UserAuditGetQuery) {
    return this.institutionService.getUserAuditQuery(data).pipe(
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

  @Action(UserAuditGetAllInformation, {cancelUncompleted: true})
  getAllInformation(ctx: StateContext<UserAuditStateModel>, {action}: UserAuditGetAllInformation) {
    action(ctx)
  }

}
