import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { ManagementDomain } from "../domain/management.domain";
import { ManagementService } from "../service/management.service";
import {ManagementAdd, ManagementDelete, ManagementGet, ManagementGetQuery, ManagementUpdate} from "./management.actions";

export class ManagementStateModel {
  data: ManagementDomain[] = [];
}

@State<ManagementStateModel>({
  name: 'managementState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class ManagementState {

  constructor(
    private managementService: ManagementService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: ManagementStateModel) {
    return state.data
  }

  @Action(ManagementGet, {cancelUncompleted: true})
  getData(ctx: StateContext<ManagementStateModel>) {
    return this.managementService.getManagement().pipe(
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

  @Action(ManagementGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<ManagementStateModel>, {data}: ManagementGetQuery) {
    return this.managementService.getManagementQuery(data).pipe(
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

  @Action(ManagementAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<ManagementStateModel>, {data}: ManagementAdd) {
    return this.managementService.addManagement(data).pipe(
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

  @Action(ManagementUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<ManagementStateModel>, {currentName, data}: ManagementUpdate) {
    return this.managementService.updateManagement(currentName, data).pipe(
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

  @Action(ManagementDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<ManagementStateModel>, {id}: ManagementDelete) {
    return this.managementService.deleteManagement(id).pipe(
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
