import {NgModule} from '@angular/core';
import {UserGroupService} from "./service/user-group.service";
import {SharedModule} from "../../shared/module/shared.module";
import { UserGroupComponent } from './user-group.component';
import { UserGroupDialogComponent } from './component/user-group-dialog/user-group-dialog.component';

@NgModule({
  declarations: [
    UserGroupComponent,
    UserGroupDialogComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    UserGroupService
  ]
})
export class UserGroupModule { }
