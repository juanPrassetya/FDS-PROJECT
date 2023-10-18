import {NgModule} from '@angular/core';
import { ActionComponent } from './action.component';
import { ActionDialogComponent } from './component/action-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    ActionComponent,
    ActionDialogComponent,
    
  ],
  imports: [
    SharedModule,
    
  ]
})
export class ActionModule { }
