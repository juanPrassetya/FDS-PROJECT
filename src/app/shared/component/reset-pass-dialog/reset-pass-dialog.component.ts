import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store, Actions, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ResetPasswordService } from 'src/app/feature/reset-password/service/reset-password.service';
import { ResetPassword } from 'src/app/feature/reset-password/state/reset-password.actions';
import { ResetPasswordState } from 'src/app/feature/reset-password/state/reset-password.state';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from '../../auth/state/auth.state';
import { RoutePathEnum } from '../../enum/route-path.enum';
import { NotificationService } from '../../services/notification.service';
import { DateUtils } from '../../utils/date.utils';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-pass-dialog',
  templateUrl: './reset-pass-dialog.component.html',
  styleUrls: ['./reset-pass-dialog.component.css']
})
export class ResetPassDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(ResetPasswordState.isPasswordReset) isPasswordReset$!: Observable<boolean>

  private destroyer$ = new Subject();

  form!: FormGroup;
  isLoading: boolean = false;
  userData: UserDomain | undefined

  constructor(
    private fb: FormBuilder,
    private store$: Store,
    private action$: Actions,
    private router: Router,
    private ngZone: NgZone,
    private resetPasswordService: ResetPasswordService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(
      data => {
        this.userData = data
      }
    )

    this.isPasswordReset$
      .pipe(
        takeUntil(this.destroyer$)
      )
      .subscribe(
        isReset => {
          if (isReset) {
            this.notificationService.successNotification('Success', 'Reset password is success, please login with new password')
            ngZone.run(() => {
              this.authService.onLogout();
            })
          }
        }
      )

    this.action$
      .pipe(
        ofActionCompleted(ResetPassword),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => this.isLoading = false)
  }

  onClose() {
    this.closeSelf.emit(false)
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPass: ['', Validators.required],
      newPass: ['', Validators.required],
      confirmPass: ['', Validators.required]
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onResetPass(data: { currentPass: string, newPass: string }) {
    this.isLoading = true

    if (this.isNewAndConfirmPassSame()) {
      this.resetPasswordService.onResetPassword(
        this.userData?.username != null ? this.userData.username : '',
        data
      )
    } else {
      this.notificationService.errorNotification("Password incorrect", "Your new password is mismatch with confirm password.")
      this.isLoading = false
    }
  }

  getCurrentPass() {
    return this.form.get("currentPass")
  }

  getNewPass() {
    return this.form.get("newPass")
  }

  getConfirmPass() {
    return this.form.get("confirmPass")
  }

  isValueNotValid() {
    return this.getCurrentPass()?.hasError("required") || this.getNewPass()?.hasError("required") || this.getConfirmPass()?.hasError("required")
  }

  isNewAndConfirmPassSame() {
    return this.getConfirmPass()?.value == this.getNewPass()?.value
  }
}
