import {NgModule} from '@angular/core';
import { ConnectsetComponent } from './connectset.component';
import { ConnectsetDialogComponent } from './component/instution-dialog/connectset-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    ConnectsetComponent,
    ConnectsetDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class ConnectsetModule { }
