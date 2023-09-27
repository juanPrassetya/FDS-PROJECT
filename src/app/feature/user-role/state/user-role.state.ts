import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import {UserRoleDomain} from "../domain/user-role.domain";
import {UserRoleService} from "../service/user-role.service";
import {OperationGet, UserRoleAdd, UserRoleDelete, UserRoleGet, UserRoleGetQuery, UserRoleUpdate} from "./user-role.actions";
import {OperationDomain} from "../domain/operation.domain";

export class UserRoleStateModel {
  data: UserRoleDomain[] = [];
  operations: OperationDomain[] = []
}

@State<UserRoleStateModel>({
  name: 'userRoleState',
  defaults: {
    data: [],
    operations: []
  }
})

@Injectable()
export class UserRoleState {

  constructor(
    private userRoleService: UserRoleService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: UserRoleStateModel) {
    return state.data
  }

  @Selector()
  static operations(state: UserRoleStateModel) {
    return state.operations
  }

  @Action(UserRoleGet, {cancelUncompleted: true})
  getData(ctx: StateContext<UserRoleStateModel>) {
    return this.userRoleService.getUserRole().pipe(
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

  @Action(UserRoleGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<UserRoleStateModel>, {data}: UserRoleGetQuery) {
    return this.userRoleService.getUserRoleQuery(data).pipe(
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

  @Action(OperationGet, {cancelUncompleted: true})
  getOperation(ctx: StateContext<UserRoleStateModel>) {
    return this.userRoleService.getOperation().pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            operations: response.responseData,
          })
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(UserRoleAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<UserRoleStateModel>, {data}: UserRoleAdd) {
    return this.userRoleService.addUserRole(data).pipe(
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

  @Action(UserRoleUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<UserRoleStateModel>, {currentName, data}: UserRoleUpdate) {
    return this.userRoleService.updateUserRole(currentName, data).pipe(
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

  @Action(UserRoleDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<UserRoleStateModel>, {id}: UserRoleDelete) {
    return this.userRoleService.deleteUserRole(id).pipe(
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
