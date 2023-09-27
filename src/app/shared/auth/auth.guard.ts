import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable, NgZone} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../services/notification.service";
import {RoutePathEnum} from "../enum/route-path.enum";
import {Store} from "@ngxs/store";
import {ResetPasswordState} from "../../feature/reset-password/state/reset-password.state";
import {AuthState} from "./state/auth.state";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private store$: Store,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.isUserLoggedIn(route, state);
  }

  private isUserLoggedIn(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      if (state.url.includes(RoutePathEnum.RESET_PASS_PATH)) {
        if (!this.store$.selectSnapshot(AuthState.userData)?.resetPassword) {
          this.router.navigate([RoutePathEnum.DASHBOARD_PATH]);
        }
        return true
      }

      const authorities = this.authService.getAuthorities()
      const menuOperation = (route.data as any).operations

      if (authorities.find(v1 => v1.includes(menuOperation)) != undefined) {
        return true
      } else {
        this.ngZone.run(() => {
          this.router.navigate([RoutePathEnum.UNAUTHORIZED_PATH]);
        })
        return true
      }

    } else {
      this.ngZone.run(() => {
        this.router.navigate([RoutePathEnum.LOGIN_PATH], {
          queryParams: { returnUrl: state.url },
        });
      })
      this.notificationService.errorNotification('User unauthorized', 'Please login first to access the other page.')
      return false
    }
  }
}
