import {EnvironmentProviders, NgModule, Provider} from '@angular/core';
import {DefaultComponent} from "../component/default/default.component";
import {HeaderComponent} from "../component/header/header.component";
import {SidebarComponent} from "../component/sidebar/sidebar.component";
import {ComponentModule} from "./component.module";
import {OverlayLoadingComponent} from "../component/overlay-loading/overlay-loading.component";
import {AuthInterceptor} from "../auth/auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {SearchCardComponent} from "../component/search-card/search-card.component";
import {AcctFabButtonComponent} from "../component/acct-fab-button/acct-fab-button.component";
import {UnauthorizedScreenComponent} from "../component/unauthorized-screen/unauthorized-screen.component";
import { ResetPassDialogComponent } from '../component/reset-pass-dialog/reset-pass-dialog.component';

const sharedComponents = [
  DefaultComponent,
  HeaderComponent,
  SidebarComponent,
  OverlayLoadingComponent,
  SearchCardComponent,
  AcctFabButtonComponent,
  UnauthorizedScreenComponent,
  ResetPassDialogComponent
]

const sharedServices: Provider | EnvironmentProviders = [

]

@NgModule({
  declarations: [sharedComponents],
  exports: [sharedComponents, ComponentModule],
  imports: [ComponentModule],
  providers: [
    sharedServices,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
})
export class SharedModule { }
