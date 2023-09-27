import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Actions, ofActionCompleted, Store} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {NotificationService} from "../../shared/services/notification.service";
import {AuthSelector} from "../../shared/auth/state/auth.selector";
import {AuthService} from "../../shared/services/auth.service";
import {RoutePathEnum} from "../../shared/enum/route-path.enum";
import {AuthLogin} from "../../shared/auth/state/auth.actions";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroyer$ = new Subject();

  form!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private store$: Store,
    private action$: Actions,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || 'home/dashboard';
    this.store$.select(AuthSelector.fullAuthState)
      .pipe(
        takeUntil(this.destroyer$),
      )
      .subscribe(authStateData => {
        if (authStateData != undefined) {
          if (this.authService.isAuthenticated()) {
            if (authStateData.userData?.resetPassword) {
              this.ngZone.run(() => {
                this.router.navigate([RoutePathEnum.RESET_PASS_PATH])
              })
            } else {
              // this.notificationService.successNotification('Hi ' + this.getUsername()?.value, DateUtils.giveGreetingByCurrentTime() + ', please use this app wisely, Thanks')
              this.ngZone.run(() => {
                this.router.navigateByUrl(returnUrl)
              })
            }
          } else {
            // this.notificationService.errorNotification("User Unauthorized", "Please use valid token to access the application")
            this.authService.removeToken()
          }
        }
      })

    this.action$
      .pipe(
        ofActionCompleted(AuthLogin),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => this.isLoading = false)
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLogin(data: { username: string, password: string }): void {
    this.isLoading = true
    this.authService.onLogin(data)
  }

  getUsername() {
    return this.form.get('username')
  }

  getPassword() {
    return this.form.get('password')
  }

  isValueNotValid() {
    return this.getUsername()?.hasError('required') || this.getPassword()?.hasError('required')
  }
}
