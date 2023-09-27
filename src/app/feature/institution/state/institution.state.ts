import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import {InstitutionDomain} from "../domain/institution.domain";
import {InstitutionService} from "../service/institution.service";
import {InstitutionAdd, InstitutionDelete, InstitutionGet, InstitutionGetQuery, InstitutionUpdate} from "./institution.actions";

export class InstitutionStateModel {
  data: InstitutionDomain[] = [];
}

@State<InstitutionStateModel>({
  name: 'institutionState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class InstitutionState {

  constructor(
    private institutionService: InstitutionService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: InstitutionStateModel) {
    return state.data
  }

  @Action(InstitutionGet, {cancelUncompleted: true})
  getData(ctx: StateContext<InstitutionStateModel>) {
    return this.institutionService.getInstitution().pipe(
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

  @Action(InstitutionGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<InstitutionStateModel>, {data}: InstitutionGetQuery) {
    return this.institutionService.getInstitutionQuery(data).pipe(
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

  @Action(InstitutionAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<InstitutionStateModel>, {data}: InstitutionAdd) {
    return this.institutionService.addInstitution(data).pipe(
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

  @Action(InstitutionUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<InstitutionStateModel>, {currentName, data}: InstitutionUpdate) {
    return this.institutionService.updateInstitution(currentName, data).pipe(
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

  @Action(InstitutionDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<InstitutionStateModel>, {id}: InstitutionDelete) {
    return this.institutionService.deleteInstitution(id).pipe(
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
