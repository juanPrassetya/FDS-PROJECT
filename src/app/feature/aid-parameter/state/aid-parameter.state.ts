import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AidParameterDomain } from '../domain/aid-parameter.domain';
import { Injectable } from '@angular/core';
import { AidParameterService } from '../service/aid-parameter.service';
import { AidParameterAdd, AidParameterDelete, AidParameterGet, AidParameterUpdate } from './aid-parameter.action';
import { tap } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';

export class AidParameterStateModel {
  data: AidParameterDomain[] = [];
}

@State<AidParameterStateModel>({
  name: 'AidParameter',
  defaults: {
    data: [],
  },
})
@Injectable()
export class AidParameterState {
  constructor(
    private aidParamService: AidParameterService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static aidParam(state: AidParameterStateModel) {
    return state.data;
  }

  @Action(AidParameterGet, { cancelUncompleted: true }) getAidParam(
    ctx: StateContext<AidParameterStateModel>
  ) {
    return this.aidParamService.getAidParameter().pipe(
      tap(
        (response) => {
          ctx.patchState({
            ...ctx.getState(),
            data: response.responseData,
          });
        },
        (error) => {
          this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AidParameterAdd, { cancelUncompleted: true }) addAidParam(
    ctx: StateContext<AidParameterStateModel>,
    { payload }: AidParameterAdd
  ) {
    return this.aidParamService.addAidParameter(payload).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => this.notificationService.errorHttpNotification(error)
      )
    );
  }

  @Action(AidParameterUpdate, { cancelUncompleted: true }) updateAidParam(
    ctx: StateContext<AidParameterStateModel>,
    { payload }: AidParameterUpdate
  ) {
    return this.aidParamService.updateAidParameter(payload).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => this.notificationService.errorHttpNotification(error)
      )
    );
  }

  @Action(AidParameterDelete, { cancelUncompleted: true }) deleteAidParam(
    ctx: StateContext<AidParameterStateModel>,
    { id }: AidParameterDelete
  ) {
    return this.aidParamService.deleteAidParameter(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => this.notificationService.errorHttpNotification(error)
      )
    );
  }
}
