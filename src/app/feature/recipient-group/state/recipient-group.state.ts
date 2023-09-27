import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { tap } from 'rxjs';
import { RecipientGroupDomain } from '../domain/recipient-group.domain';
import { RecipientGroupService } from '../service/recipient-group.service';
import {
  RecipientGroupAdd,
  RecipientGroupDelete,
  RecipientGroupGet,
  RecipientGroupGetAllInformation,
  RecipientGroupGetQuery,
  RecipientGroupUpdate,
} from './recipient-group.actions';

export class RecipientGroupStateModel {
  data: RecipientGroupDomain[] = [];
}

@State<RecipientGroupStateModel>({
  name: 'recipientGroupState',
  defaults: {
    data: [],
  },
})
@Injectable()
export class RecipientGroupState {
  constructor(
    private recipientGroupService: RecipientGroupService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: RecipientGroupStateModel) {
    return state.data;
  }

  @Action(RecipientGroupGet, { cancelUncompleted: true })
  getData(ctx: StateContext<RecipientGroupStateModel>) {
    return this.recipientGroupService.getRecipientGroup().pipe(
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

  @Action(RecipientGroupGetQuery, { cancelUncompleted: true })
  getDataQuery(
    ctx: StateContext<RecipientGroupStateModel>,
    { data }: RecipientGroupGetQuery
  ) {
    return this.recipientGroupService.getRecipientGroupQuery(data).pipe(
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

  @Action(RecipientGroupAdd, { cancelUncompleted: true })
  addData(
    ctx: StateContext<RecipientGroupStateModel>,
    { data }: RecipientGroupAdd
  ) {
    return this.recipientGroupService.addRecipientGroup(data).pipe(
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

  @Action(RecipientGroupUpdate, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<RecipientGroupStateModel>,
    { currentId, data }: RecipientGroupUpdate
  ) {
    return this.recipientGroupService
      .updateRecipientGroup(currentId, data)
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

  @Action(RecipientGroupDelete, { cancelUncompleted: true })
  deleteData(
    ctx: StateContext<RecipientGroupStateModel>,
    { id }: RecipientGroupDelete
  ) {
    return this.recipientGroupService.deleteRecipientGroup(id).pipe(
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

  @Action(RecipientGroupGetAllInformation, { cancelUncompleted: true })
  getAllInformation(
    ctx: StateContext<RecipientGroupStateModel>,
    { action }: RecipientGroupGetAllInformation
  ) {
    action(ctx);
  }
}
