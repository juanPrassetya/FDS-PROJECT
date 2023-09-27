import { CustomHttpResponse } from 'src/app/shared/domain/customHttpResponse';
import { ResponseCodeDomain } from '../domain/response-code.domain';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ResponseCodeService } from '../service/response-code.service';
import {
  GetResponseCode,
  AddResponseCode,
  DeleteResponseCode,
  UpdateResponseCode,
  getResponseCodeById,
  GetResponseCodeQuery,
} from './response-code.action';

export class ResponseCodeStateModel {
  responseCode: ResponseCodeDomain[] = [];
}

@State<ResponseCodeStateModel>({
  name: 'ResponseCode',
  defaults: {
    responseCode: [],
  },
})
@Injectable()
export class ResponseCodeState {
  constructor(
    private responseCodeService: ResponseCodeService,
    private notifierService: NotificationService
  ) {}

  @Selector()
  static Responsecode(state: ResponseCodeStateModel) {
    return state.responseCode;
  }

  @Action(GetResponseCode, { cancelUncompleted: true }) getDataFromState(
    ctx: StateContext<ResponseCodeStateModel>, {id}: GetResponseCode
  ) {
    return this.responseCodeService.getAllResponseCode(id).pipe(
      tap(
        (response) => {
          ctx.patchState({
            ...ctx.getState(),
            responseCode: response.responseData,
          });
        },
        (error) => {
          if (error.status == 404) {
            ctx.setState({
              ...ctx.getState(),
              responseCode: [],
            });
          } else this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(GetResponseCodeQuery, { cancelUncompleted: true })
  getDataQueryFromState(
    ctx: StateContext<ResponseCodeStateModel>,
    { data }: GetResponseCodeQuery
  ) {
    return this.responseCodeService.getAllResponseCodeQuery(data).pipe(
      tap(
        (response) => {
          ctx.patchState({
            ...ctx.getState(),
            responseCode: response.responseData,
          });
        },
        (error) => {
          if (error.status == 404) {
            ctx.setState({
              ...ctx.getState(),
              responseCode: [],
            });
          } else this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(getResponseCodeById, { cancelUncompleted: true }) getById(
    ctx: StateContext<ResponseCodeStateModel>,
    { id }: getResponseCodeById
  ) {
    return this.responseCodeService.getResponseCodeById(id).pipe(
      tap(
        (response) => {
          ctx.patchState({
            ...ctx.getState(),
            responseCode: response.responseData,
          });
        },
        (error) => {
          if (error.status == 404) {
            ctx.setState({
              ...ctx.getState(),
              responseCode: [],
            });
          } else this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AddResponseCode, { cancelUncompleted: true }) addDataFromState(
    ctx: StateContext<ResponseCodeStateModel>,
    { payload }: AddResponseCode
  ) {
    return this.responseCodeService.addResponseCode(payload).pipe(
      tap(
        (response) => {
          this.notifierService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(DeleteResponseCode, { cancelUncompleted: true }) deleteDataFromState(
    ctx: StateContext<ResponseCodeStateModel>,
    { id }: DeleteResponseCode
  ) {
    return this.responseCodeService.deleteResponseCode(id).pipe(
      tap(
        (response) => {
          this.notifierService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(UpdateResponseCode, { cancelUncompleted: true }) updateDataFromState(
    ctx: StateContext<ResponseCodeStateModel>,
    { payload }: UpdateResponseCode
  ) {
    return this.responseCodeService.updateResponseCode(payload).pipe(
      tap(
        (response) => {
          this.notifierService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }
}
