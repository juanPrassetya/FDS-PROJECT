import {Component, NgZone} from '@angular/core';
import {Router} from "@angular/router";
import {RoutePathEnum} from "../../enum/route-path.enum";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-unauthorized-screen',
  templateUrl: './unauthorized-screen.component.html',
  styleUrls: ['./unauthorized-screen.component.css']
})
export class UnauthorizedScreenComponent {

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private authService: AuthService
  ) {
  }

  onClickGoBack() {
    this.ngZone.run(() => {
      this.router.navigate([RoutePathEnum.LOGIN_PATH])
        .then(() => {
          this.authService.removeToken()
          window.location.reload();
        });
    })
  }
}
