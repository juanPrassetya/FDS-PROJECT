import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RuleDomain} from "../../rule/domain/rule.domain";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {tap} from "rxjs";
import {UserGroupDomain} from "../domain/user-group.domain";
import {UserGroupAdd, UserGroupDelete, UserGroupGet, UserGroupGetQuery, UserGroupUpdate} from "./user-group.actions";
import {UserGroupService} from "../service/user-group.service";
import {NotificationService} from "../../../shared/services/notification.service";

export class UserGroupStateModel {
  userGroups: UserGroupDomain[] = [];
  httpResponses: CustomHttpResponse<RuleDomain> | undefined;
}

@State<UserGroupStateModel>({
  name: 'userGroupState',
  defaults: {
    userGroups: [],
    httpResponses: undefined
  }
})

@Injectable()
export class UserGroupState {

  constructor(
    private userGroupService: UserGroupService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static userGroups(state: UserGroupStateModel) {
    return state.userGroups;
  }

  @Action(UserGroupGet, {cancelUncompleted: true})
  getData(ctx: StateContext<UserGroupStateModel>) {
    return this.userGroupService.fetchAllUserGroup().pipe(
      tap(response => {
          ctx.setState({
            ...ctx.getState(),
            userGroups: response.responseData,
          })
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(UserGroupGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<UserGroupStateModel>, {data}: UserGroupGetQuery) {
    return this.userGroupService.fetchAllUserGroupQuery(data).pipe(
      tap(response => {
          ctx.setState({
            ...ctx.getState(),
            userGroups: response.responseData,
          })
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(UserGroupAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<UserGroupStateModel>, {data}: UserGroupAdd) {
    return this.userGroupService.addUserGroup(data).pipe(
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

  @Action(UserGroupUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<UserGroupStateModel>, {currentName, data}: UserGroupUpdate) {
    return this.userGroupService.updateUserGroup(currentName, data).pipe(
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

  @Action(UserGroupDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<UserGroupStateModel>, {id}: UserGroupDelete) {
    return this.userGroupService.deleteUserGroup(id).pipe(
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
