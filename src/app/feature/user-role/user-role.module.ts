import {NgModule} from '@angular/core';
import {UserRoleComponent} from './user-role.component';
import {SharedModule} from "../../shared/module/shared.module";
import { UserRoleDetailComponent } from './component/user-role-detail/user-role-detail.component';
import { UserRoleDialogComponent } from './component/user-role-dialog/user-role-dialog.component';


@NgModule({
  declarations: [
    UserRoleComponent,
    UserRoleDetailComponent,
    UserRoleDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class UserRoleModule {
}
