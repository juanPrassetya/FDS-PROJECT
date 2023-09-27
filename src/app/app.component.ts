import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "./shared/services/auth.service";
import {Actions, ofActionCompleted, Select} from "@ngxs/store";
import {AuthState} from "./shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "./feature/user/domain/user.domain";
import {AuthGetUserData} from "./shared/auth/state/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();

  title = 'FDS-UI';
  showFiller = false;
  isLoading: boolean = true;
  userData: UserDomain | undefined

  constructor(
    private action$: Actions,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.onGetUserData()
    } else {
      this.authService.onLogout()
      this.isLoading = false
    }

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data
    })

    this.action$.pipe(
      ofActionCompleted(AuthGetUserData),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.complete()
  }
}
