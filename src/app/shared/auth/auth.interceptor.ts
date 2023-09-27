import {Injectable, NgZone} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthDispatcher} from "./state/auth.dispatcher";
import {Select, Store} from "@ngxs/store";
import {AuthState} from "./state/auth.state";
import {AuthTokenRefresh} from "./state/auth.actions";
import {Router} from "@angular/router";
import {RoutePathEnum} from "../enum/route-path.enum";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @Select(AuthState.token) token$!: Observable<{ at: string, rt: string }>

  constructor(
    private store$: Store,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService,
  ) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userData = this.store$.selectSnapshot(state => state.authState.userData)
    if (req.url.includes(RoutePathEnum.LOGIN_PATH) && (userData == undefined)) {
      throw new HttpErrorResponse({
        error: {error: 'User Unauthorized', message: 'User data not found in cache'},
        headers: req.headers,
        status: 500,
        statusText: 'Warning',
        url: req.url
      });
    }

    let token: string;
    if (req.url.includes(RoutePathEnum.TOKEN_REFRESH_PATH)) {
      token = this.authService.loadRT()
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })

      return next.handle(req)

    } else {
      token = this.authService.loadAT()
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })

      // if (this.store$.selectSnapshot(state => state.authState.userData) != undefined)
      return next.handle(req)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              // this.authDispatcher._AuthTokenRefresh()
              return this.store$.dispatch(new AuthTokenRefresh()).pipe(
                switchMap(() => {
                  const newAT = this.store$.selectSnapshot(state => state.authState.token.at)

                  if (newAT != undefined)
                    return next.handle(
                      req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${newAT}`
                        }
                      })
                    )
                  else
                    return throwError('Not receive new token from server')
                }),

                catchError((err) => {
                  this.authService.removeToken()
                  this.ngZone.run(() => {
                    this.router.navigate([RoutePathEnum.LOGIN_PATH])
                  })
                  return throwError(err)
                })
              )
            } else {
              return throwError(err)
            }
          })
        )
    }
  }

}
