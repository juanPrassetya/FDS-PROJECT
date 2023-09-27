import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {NotificationService} from '../../../shared/services/notification.service';
import {UserDomain} from '../domain/user.domain';
import {UserService} from '../service/user.service';
import {tap} from 'rxjs';
import {
  UserAdd,
  UserDelete,
  UserGet,
  UserGetAllInformation,
  UserGetForward,
  UserGetQuery,
  UserResetPassword,
  UserUpdate
} from './user.actions';

export class UserStateModel {
  data: UserDomain[] = [];
  userForward: UserDomain[] = [];
}

@State<UserStateModel>({
  name: 'userState',
  defaults: {
    data: [],
    userForward: []
  },
})
@Injectable()
export class UserState {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: UserStateModel) {
    return state.data;
  }

  @Action(UserGet, { cancelUncompleted: true })
  getData(ctx: StateContext<UserStateModel>) {
    return this.userService.getUser().pipe(
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

  @Action(UserGetQuery, { cancelUncompleted: true })
  getDataQuery(ctx: StateContext<UserStateModel>, {data}: UserGetQuery) {
    return this.userService.getUserQuery(data).pipe(
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

  @Action(UserGet, { cancelUncompleted: true })
  getUserForward(ctx: StateContext<UserStateModel>, {username}: UserGetForward) {
    return this.userService.getUser().pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            userForward: response.responseData,
          });
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(UserAdd, { cancelUncompleted: true })
  addData(ctx: StateContext<UserStateModel>, { payload }: UserAdd) {
    return this.userService.addUser(payload).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(UserUpdate, { cancelUncompleted: true })
  updateData(ctx: StateContext<UserStateModel>, { currentName, payload }: UserUpdate) {
    return this.userService.updateUser(currentName, payload).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(UserDelete, { cancelUncompleted: true })
  deleteData(ctx: StateContext<UserStateModel>, { id }: UserDelete) {
    return this.userService.deleteUser(id).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(UserResetPassword, { cancelUncompleted: true })
  resetPass(ctx: StateContext<UserStateModel>, { username, data }: UserResetPassword) {
    return this.userService.resetPassword(username, data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(UserGetAllInformation, { cancelUncompleted: true })
  getAllInformation(ctx: StateContext<UserStateModel>, {action}: UserGetAllInformation) {
    action(ctx)
    // await lastValueFrom(ctx.dispatch(new UserRoleGet()))
    // await lastValueFrom(ctx.dispatch(new InstitutionGet()))
    // await lastValueFrom(ctx.dispatch(new UserGroupGet()))
  }
}
