import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { tap } from 'rxjs';
import { RecipientSetupDomain } from '../domain/recipient-setup.domain';
import { RecipientSetupService } from '../service/recipient-setup.service';
import {
  RecipientSetupAdd,
  RecipientSetupDelete,
  RecipientSetupGet,
  RecipientSetupGetAllInformation,
  RecipientSetupGetQuery,
  RecipientSetupUpdate,
} from './recipient-setup.actions';

export class RecipientSetupStateModel {
  data: RecipientSetupDomain[] = [];
}

@State<RecipientSetupStateModel>({
  name: 'recipientSetupState',
  defaults: {
    data: [],
  },
})
@Injectable()
export class RecipientSetupState {
  constructor(
    private recipientSetupService: RecipientSetupService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: RecipientSetupStateModel) {
    return state.data;
  }

  @Action(RecipientSetupGet, { cancelUncompleted: true })
  getData(ctx: StateContext<RecipientSetupStateModel>) {
    return this.recipientSetupService.getRecipientSetup().pipe(
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

  @Action(RecipientSetupGetQuery, { cancelUncompleted: true })
  getDataQuery(
    ctx: StateContext<RecipientSetupStateModel>,
    { data }: RecipientSetupGetQuery
  ) {
    return this.recipientSetupService.getRecipientSetupQuery(data).pipe(
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

  @Action(RecipientSetupAdd, { cancelUncompleted: true })
  addData(
    ctx: StateContext<RecipientSetupStateModel>,
    { data }: RecipientSetupAdd
  ) {
    return this.recipientSetupService.addRecipientSetup(data).pipe(
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

  @Action(RecipientSetupUpdate, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<RecipientSetupStateModel>,
    { currentId, data }: RecipientSetupUpdate
  ) {
    return this.recipientSetupService
      .updateRecipientSetup(currentId, data)
      .pipe(
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

  @Action(RecipientSetupDelete, { cancelUncompleted: true })
  deleteData(
    ctx: StateContext<RecipientSetupStateModel>,
    { id }: RecipientSetupDelete
  ) {
    return this.recipientSetupService.deleteRecipientSetup(id).pipe(
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

  @Action(RecipientSetupGetAllInformation, { cancelUncompleted: true })
  getAllInformation(
    ctx: StateContext<RecipientSetupStateModel>,
    { action }: RecipientSetupGetAllInformation
  ) {
    action(ctx);
  }
}
