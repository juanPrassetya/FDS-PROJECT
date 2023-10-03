import {NgModule} from '@angular/core';
import { KeysComponent } from './keys.component';
import { KeysDialogComponent } from './component/keys-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    KeysComponent,
    KeysDialogComponent,
    
  ],
  imports: [
    SharedModule,
    
  ]
})
export class KeysModule { }
