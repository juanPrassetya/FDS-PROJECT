import {NgModule} from '@angular/core';
import { PanComponent } from './pan.component';
import { PanDialogComponent } from './component/pan-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    PanComponent,
    PanDialogComponent,
    
  ],
  imports: [
    SharedModule,
    
  ]
})
export class PanModule { }
