import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { tap } from 'rxjs';
import { NotifTemplateDomain } from '../domain/notif-template.domain';
import { NotifTemplateService } from '../service/notif-template.service';
import {
  NotifTemplateAdd,
  NotifTemplateDelete,
  NotifTemplateGet,
  NotifTemplateGetAllInformation,
  NotifTemplateGetQuery,
  NotifTemplateUpdate,
} from './notif-template.actions';

export class NotifTemplateStateModel {
  data: NotifTemplateDomain[] = [];
}

@State<NotifTemplateStateModel>({
  name: 'notificationTemplateState',
  defaults: {
    data: [],
  },
})
@Injectable()
export class NotifTemplateState {
  constructor(
    private blackListService: NotifTemplateService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: NotifTemplateStateModel) {
    return state.data;
  }

  @Action(NotifTemplateGet, { cancelUncompleted: true })
  getData(ctx: StateContext<NotifTemplateStateModel>) {
    return this.blackListService.getNotifTemplate().pipe(
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

  @Action(NotifTemplateGetQuery, { cancelUncompleted: true })
  getDataQuery(
    ctx: StateContext<NotifTemplateStateModel>,
    { data }: NotifTemplateGetQuery
  ) {
    return this.blackListService.getNotifTemplateQuery(data).pipe(
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

  @Action(NotifTemplateAdd, { cancelUncompleted: true })
  addData(
    ctx: StateContext<NotifTemplateStateModel>,
    { data }: NotifTemplateAdd
  ) {
    return this.blackListService.addNotifTemplate(data).pipe(
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

  @Action(NotifTemplateUpdate, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<NotifTemplateStateModel>,
    { currentId, data }: NotifTemplateUpdate
  ) {
    return this.blackListService.updateNotifTemplate(currentId, data).pipe(
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

  @Action(NotifTemplateDelete, { cancelUncompleted: true })
  deleteData(
    ctx: StateContext<NotifTemplateStateModel>,
    { id }: NotifTemplateDelete
  ) {
    return this.blackListService.deleteNotifTemplate(id).pipe(
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

  @Action(NotifTemplateGetAllInformation, { cancelUncompleted: true })
  getAllInformation(
    ctx: StateContext<NotifTemplateStateModel>,
    { action }: NotifTemplateGetAllInformation
  ) {
    action(ctx);
  }
}
