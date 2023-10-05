import {NgModule} from '@angular/core';
import { MappingComponent } from './mapping.component';
import { MappingDialogComponent } from './component/instution-dialog/mapping-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    MappingComponent,
    MappingDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MappingModule { }
