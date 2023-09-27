import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { FraudListDomain } from '../domain/fraud-list.domain';
import { FraudListService } from '../service/fraud-list.service';
import {
  FraudListAdd,
  FraudListDelete,
  FraudListGet,
  FraudListGetAllInformation,
  FraudListGetByEntity,
  FraudListGetQuery,
  FraudListResetAllInformation,
  FraudListUpdate,
} from './fraud-list.actions';
import { tap } from 'rxjs';

export class FraudListStateModel {
  data: FraudListDomain[] = [];
  dataByEntity: FraudListDomain[] = [];
}

@State<FraudListStateModel>({
  name: 'fraudListState',
  defaults: {
    data: [],
    dataByEntity: [],
  },
})
@Injectable()
export class FraudListState {
  constructor(
    private fraudListService: FraudListService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: FraudListStateModel) {
    return state.data;
  }

  @Selector()
  static dataByEntity(state: FraudListStateModel) {
    return state.dataByEntity;
  }

  @Action(FraudListGet, { cancelUncompleted: true })
  getData(ctx: StateContext<FraudListStateModel>) {
    return this.fraudListService.getFraudList().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            data: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(FraudListGetQuery, { cancelUncompleted: true })
  getDataByQuery(
    ctx: StateContext<FraudListStateModel>,
    { data }: FraudListGetQuery
  ) {
    return this.fraudListService.getFraudListByQuery(data).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            data: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(FraudListGetByEntity, { cancelUncompleted: true })
  getDataByEntity(
    ctx: StateContext<FraudListStateModel>,
    { entity }: FraudListGetByEntity
  ) {
    return this.fraudListService.getFraudListByEntity(entity).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            dataByEntity: response.responseData,
          });
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(FraudListAdd, { cancelUncompleted: true })
  addData(ctx: StateContext<FraudListStateModel>, { data }: FraudListAdd) {
    return this.fraudListService.addFraudList(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(FraudListUpdate, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<FraudListStateModel>,
    { currentListName, data }: FraudListUpdate
  ) {
    return this.fraudListService.updateFraudList(currentListName, data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(FraudListDelete, { cancelUncompleted: true })
  deleteData(ctx: StateContext<FraudListStateModel>, { id }: FraudListDelete) {
    return this.fraudListService.deleteFraudList(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(FraudListGetAllInformation, { cancelUncompleted: true })
  getAllInformation(
    ctx: StateContext<FraudListStateModel>,
    { action }: FraudListGetAllInformation
  ) {
    action(ctx);
  }

  @Action(FraudListResetAllInformation, { cancelUncompleted: true })
  resetAllInformation(
    ctx: StateContext<FraudListStateModel>,
    { action }: FraudListResetAllInformation
  ) {
    action(ctx);
  }
}
