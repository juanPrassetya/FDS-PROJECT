import { Component, NgZone } from '@angular/core';
import {
  animate,
  keyframes,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { RoutePathEnum } from '../../enum/route-path.enum';
import { Router } from '@angular/router';

export const speedDialFabAnimations = [
  trigger('fabToggler', [
    state(
      'inactive',
      style({
        // transform: 'rotate(0deg)'
      })
    ),
    state(
      'active',
      style({
        // transform: 'rotate(225deg)'
      })
    ),
    transition('* <=> *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
  trigger('speedDialStagger', [
    transition('* => *', [
      query(':enter', style({ opacity: 0 }), { optional: true }),

      query(
        ':enter',
        stagger('40ms', [
          animate(
            '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes([
              style({ opacity: 0, transform: 'translateY(10px)' }),
              style({ opacity: 1, transform: 'translateY(0)' }),
            ])
          ),
        ]),
        { optional: true }
      ),

      query(
        ':leave',
        animate(
          '200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([style({ opacity: 1 }), style({ opacity: 0 })])
        ),
        { optional: true }
      ),
    ]),
  ]),
];

@Component({
  selector: 'app-acct-fab-button',
  templateUrl: './acct-fab-button.component.html',
  styleUrls: ['./acct-fab-button.component.css'],
  animations: speedDialFabAnimations,
})
export class AcctFabButtonComponent {
  fabButtons = [
    {
      icon: 'bx bx-lock',
      tooltip: 'Reset Password',
      style: 'fab-secondary',
      click: () => {
        this.visibleResetPassDialog = true;
      }
    },
    {
      icon: 'bx bx-exit',
      tooltip: 'Logout',
      style: 'fab-secondary fab-red',
      click: () => {
        this.logout();
      },
    },
  ];
  buttons: any[] = [];
  fabTogglerState = 'inactive';
  zindex = 1;
  visibleResetPassDialog: boolean = false;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService
  ) {}

  showItems() {
    this.zindex = 100;
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    setTimeout(() => {
      this.zindex = 1;
    }, 300);
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onCloseResetPassDialog(stat: boolean) {
    this.visibleResetPassDialog = stat
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }

  logout() {
    this.authService.removeToken();
    this.ngZone.run(() => {
      this.router.navigate([RoutePathEnum.LOGIN_PATH]).then(() => {
        window.location.reload();
      });
    });
  }
}
