import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {StringUtils} from "../../utils/string.utils";
import {AuthService} from "../../services/auth.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {Select} from "@ngxs/store";
import {AuthState} from "../../auth/state/auth.state";
import {UserDomain} from "../../../feature/user/domain/user.domain";
import {HeaderService} from "./service/header.service";
import {UserNotificationDomain} from "./domain/user-notification.domain";
import {HeaderState} from "./state/header.state";
import {DateUtils} from "../../utils/date.utils";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(HeaderState.userNotifs) userNotifs$!: Observable<UserNotificationDomain[]>

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;

  items: MenuItem[] = [];
  home: MenuItem | any;
  userData!: UserDomain
  userNotifs: Array<UserNotificationDomain> = []

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private headerService: HeaderService
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Get the current route URL and split it into segments
        const url = event.urlAfterRedirects;
        const segments = url.split('/').slice(1);

        // Build the breadcrumb items based on the segments
        const breadcrumbItems: MenuItem[] | { label: string;}[] = [];

        segments.forEach((segment, index) => {

          if (!segment.includes('home')){
            breadcrumbItems.push({
              label: StringUtils.capitalizeFirstLetter(segment)
            });
          }
        });

        // Update the breadcrumb items
        this.items = breadcrumbItems;
      }
    });
  }

  ngOnInit() {
    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data

      if (data != undefined) {
        this.headerService.onFetchUserNotification(Number(data.id))
      }
    })

    this.userNotifs$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userNotifs = data
    })
  }

  ngOnDestroy() {
    this.destroyer$.complete()
  }

  notifTypeChecker(notificationType: string) {
    switch (notificationType) {
      case 'Alert Investigation':
        return 'bx bx-bell'
      default:
        return ''
    }
  }

  onNotifPanelShow() {
    if (this.userData != undefined) {
      this.headerService.onFetchUserNotification(Number(this.userData.id))
    }
  }

  onNotifClicked(notificationType: string, event: any, element: any) {
    switch (notificationType) {
      case 'Alert Investigation':
        this.ngZone.run(() => {
          this.router.navigate(['home/fraud-management/alert-investigation']).then(
            element.hide(event)
          )
        })
        break;

      default:
        break;
    }
  }
}
