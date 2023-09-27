import {NgModule} from '@angular/core';
import {SharedModule} from "../../shared/module/shared.module";
import {ResetPasswordComponent} from "./reset-password.component";
import {ResetPasswordService} from "./service/reset-password.service";

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  exports: [
    ResetPasswordComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    ResetPasswordService
  ]
})
export class ResetPasswordModule { }
