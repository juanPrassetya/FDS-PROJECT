import {NgModule} from '@angular/core';
import { MessagesetComponent } from './messageset.component';
import { MessagesetDialogComponent } from './component/messageset-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    MessagesetComponent,
    MessagesetDialogComponent,
    
  ],
  imports: [
    SharedModule,
    
  ]
})
export class MessagesetModule { }
