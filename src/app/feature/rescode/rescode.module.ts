import {NgModule} from '@angular/core';
import { RescodeComponent } from './rescode.component';
import { RescodeDialogComponent } from './component/instution-dialog/rescode-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    RescodeComponent,
    RescodeDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RescodeModule { }
