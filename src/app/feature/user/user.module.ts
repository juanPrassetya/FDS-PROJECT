import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "./service/user.service";
import {UserComponent} from "./user.component";
import {SharedModule} from "../../shared/module/shared.module";
import {UserDialogComponent} from './component/user-dialog/user-dialog.component';
import {UserResetActionComponent} from './component/user-reset-action/user-reset-action.component';

@NgModule({
  declarations: [
    UserComponent,
    UserDialogComponent,
    UserResetActionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [UserService]
})
export class UserModule { }
