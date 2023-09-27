import {NgModule} from '@angular/core';
import {LoginComponent} from "./login.component";
import {SharedModule} from "../../shared/module/shared.module";

@NgModule({
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
  ]
})
export class LoginModule { }
