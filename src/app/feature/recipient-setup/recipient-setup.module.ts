import {NgModule} from '@angular/core';
import {RecipientSetupComponent} from './recipient-setup.component';
import {SharedModule} from "../../shared/module/shared.module";
import { RecipientSetupDialogComponent } from './component/recipient-setup-dialog/recipient-setup-dialog.component';


@NgModule({
  declarations: [
    RecipientSetupComponent,
    RecipientSetupDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RecipientSetupModule { }
