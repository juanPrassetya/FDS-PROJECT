import {NgModule} from '@angular/core';
import {RecipientGroupComponent} from './recipient-group.component';
import {RecipientGroupDialogComponent} from './component/recipient-group-dialog/recipient-group-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    RecipientGroupComponent,
    RecipientGroupDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class RecipientGroupModule { }
