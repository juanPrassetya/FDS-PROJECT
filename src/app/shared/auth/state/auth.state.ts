import {Action, Selector, State, StateContext, Store} from "@ngxs/store";
import {Injectable, NgZone} from "@angular/core";
import {tap} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {AuthGetUserData, AuthLogin, AuthLogout, AuthTokenRefresh} from "./auth.actions";
import {NotificationService} from "../../services/notification.service";
import {UserDomain} from "../../../feature/user/domain/user.domain";
import {Router} from "@angular/router";
import {RoutePathEnum} from "../../enum/route-path.enum";

export class AuthStateModel {
  userData: UserDomain | undefined;
  token: { at: string | null, rt: string | null } | undefined;
  roles: string | undefined;
  operations: string[] = [];
}

@State<AuthStateModel>({
  name: 'authState',
  defaults: {
    userData: undefined,
    token: undefined,
    roles: undefined,
    operations: [],
  }
})

@Injectable()
export class AuthState {

  constructor(
    private store: Store,
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
  }

  // ngxsOnInit(ctx: StateContext<AuthStateModel>) {
  //   if (this.authService.isAuthenticated()) {
  //     ctx.dispatch(new AuthGetUserData())
  //   } else {
  //     ctx.dispatch(new AuthLogout())
  //   }
  // }

  @Selector()
  static userData(state: AuthStateModel) {
    return state.userData;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  @Selector()
  static roles(state: AuthStateModel) {
    return state.roles;
  }

  @Action(AuthLogin, {cancelUncompleted: true})
  authLogin(ctx: StateContext<AuthStateModel>, {username, password}: AuthLogin) {
    return this.authService.login({username, password}).pipe(
      tap(
        response => {
          const token = this.authService.onGetToken(response);

          if (token.at != null && token.rt != null) {
            this.authService.saveToken(token)
          }

          ctx.setState({
            ...ctx.getState(),
            token: token,
            userData: response.body?.responseData,
            roles: this.authService.getUserRole(token.at),
            operations: this.authService.getUserOperation(token.at),
          })
        },

        error => {
          console.log(error)
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(AuthLogout, {cancelUncompleted: true})
  authLogout(ctx: StateContext<AuthStateModel>) {
    // this.store.reset({
    //
    // })
    this.authService.removeToken()
    this.ngZone.run(() => {
      this.router.navigate([RoutePathEnum.LOGIN_PATH])
    })
  }

  @Action(AuthGetUserData, {cancelUncompleted: true})
  authGetUserData(ctx: StateContext<AuthStateModel>) {
    return this.authService.loadCurrentUserBySub().pipe(
      tap(
        response => {
          ctx.patchState({
            ...ctx.getState(),
            userData: response.responseData,
            roles: this.authService.getUserRole(this.authService.loadAT()),
            operations: this.authService.getUserOperation(this.authService.loadAT()),
            token: {at: this.authService.loadAT(), rt: this.authService.loadRT()}
          })
        },

        error => {
          if (error.status != 401) {
            this.notificationService.errorHttpNotification(error)
          }

          if (error.status != 0) {
            ctx.dispatch(new AuthLogout())
          }
        }
      )
    )
  }

  @Action(AuthTokenRefresh, {cancelUncompleted: true})
  authTokenRefresh(ctx: StateContext<AuthStateModel>) {
    return this.authService.refreshToken().pipe(
      tap(
        response => {
          const token = this.authService.onGetToken(response);

          if (token.at != null && token.rt != null) {
            this.authService.saveToken(token)
          }

          ctx.patchState({
            ...ctx.getState(),
            token: token
          })
        },

        (error) => {
          this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }
}
