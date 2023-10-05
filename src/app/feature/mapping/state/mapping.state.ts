import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {NotificationService} from "../../../shared/services/notification.service";
import {tap} from "rxjs";
import { MappingDomain } from "../domain/mapping.domain";
import { MappingService } from "../service/mapping.service";
import {MappingAdd, MappingDelete, MappingGet, MappingGetQuery, MappingUpdate} from "./mapping.actions";

export class MappingStateModel {
  data: MappingDomain[] = [];
}

@State<MappingStateModel>({
  name: 'mappingState',
  defaults: {
    data: [],
  }
})

@Injectable()
export class MappingState {

  constructor(
    private mappingService: MappingService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static data(state: MappingStateModel) {
    return state.data
  }

  @Action(MappingGet, {cancelUncompleted: true})
  getData(ctx: StateContext<MappingStateModel>) {
    return this.mappingService.getMapping().pipe(
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

  @Action(MappingGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<MappingStateModel>, {data}: MappingGetQuery) {
    return this.mappingService.getMappingQuery(data).pipe(
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

  @Action(MappingAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<MappingStateModel>, {data}: MappingAdd) {
    return this.mappingService.addMapping(data).pipe(
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

  @Action(MappingUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<MappingStateModel>, {currentName, data}: MappingUpdate) {
    return this.mappingService.updateMapping(currentName, data).pipe(
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

  @Action(MappingDelete, {cancelUncompleted: true})
  deleteData(ctx: StateContext<MappingStateModel>, {id}: MappingDelete) {
    return this.mappingService.deleteMapping(id).pipe(
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
