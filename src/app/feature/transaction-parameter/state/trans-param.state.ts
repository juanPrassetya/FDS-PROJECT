import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { TransParamService } from '../service/trans-param.service';
import { TransParamDomain } from '../domain/trans-param.domain';
import {
  ResetTransParamById,
  TransParamAdd,
  TransParamDelete,
  TransParamGet,
  TransParamGetByEndpoint,
  TransParamGetById,
  TransParamGetCommon,
  TransParamGetQuery,
  TransParamUpdate,
} from './trans-param.actions';
import { NotificationService } from '../../../shared/services/notification.service';
import { data } from 'autoprefixer';

export class TransParamStateModel {
  transParams: TransParamDomain[] = [];
  transParamsCommon: TransParamDomain[] = [];
}

@State<TransParamStateModel>({
  name: 'transParamState',
  defaults: {
    transParams: [],
    transParamsCommon: [],
  },
})
@Injectable()
export class TransParamState {
  constructor(
    private transParamService: TransParamService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static transParams(state: TransParamStateModel) {
    return state.transParams;
  }

  @Selector()
  static transParamsCommon(state: TransParamStateModel) {
    return state.transParamsCommon;
  }

  @Action(TransParamGet, { cancelUncompleted: true })
  getData(ctx: StateContext<TransParamStateModel>) {
    return this.transParamService.fetchAllTransParam().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            transParams: response.responseData,
          });
        },
        (error) => {
          // if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

  @Action(TransParamGetByEndpoint, { cancelUncompleted: true })
  getDataByEndpoint(ctx: StateContext<TransParamStateModel>, {id}: TransParamGetByEndpoint) {
    return this.transParamService.fetchAllTransParamByEndpoint(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            transParams: response.responseData,
          });
        },
        (error) => {
          // if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

  @Action(TransParamGetById, { cancelUncompleted: true })
  getDataById(ctx: StateContext<TransParamStateModel>, {id}: TransParamGetById) {
    return this.transParamService.fetchAllTransParamById(id).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            transParams: response.responseData,
          });
        },
        (error) => {
          // if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

  @Action(TransParamGetQuery, { cancelUncompleted: true })
  getDataQuery(
    ctx: StateContext<TransParamStateModel>,
    { data }: TransParamGetQuery
  ) {
    return this.transParamService.fetchAllTransParamQuery(data).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            transParams: response.responseData,
          });
        },
        (error) => {
          // if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

  @Action(TransParamGetCommon, { cancelUncompleted: true })
  getDataCommon(ctx: StateContext<TransParamStateModel>) {
    return this.transParamService.fetchAllTransParamCommon().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            transParamsCommon: response.responseData,
          });
        },
        (error) => {
          // if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

  @Action(TransParamAdd, { cancelUncompleted: true })
  addData(ctx: StateContext<TransParamStateModel>, { payload }: TransParamAdd) {
    return this.transParamService.addTransParam(payload).pipe(
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

  @Action(TransParamUpdate, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<TransParamStateModel>,
    { payload }: TransParamUpdate
  ) {
    return this.transParamService.updateTransParam(payload).pipe(
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

  @Action(TransParamDelete, { cancelUncompleted: true })
  deleteData(
    ctx: StateContext<TransParamStateModel>,
    { id }: TransParamDelete
  ) {
    return this.transParamService.deleteTransParam(id).pipe(
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

  @Action(ResetTransParamById, {cancelUncompleted: true})
  resetDataById(ctx: StateContext<TransParamStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      transParams: [],
    })
  }
}
