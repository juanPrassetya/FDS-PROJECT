import {NgModule} from '@angular/core';
import { ManagementComponent } from './management.component';
import { ManagementDialogComponent } from './component/instution-dialog/management-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    ManagementComponent,
    ManagementDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ManagementModule { }
