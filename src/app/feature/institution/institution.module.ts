import {NgModule} from '@angular/core';
import {InstitutionComponent} from './institution.component';
import {InstitutionDialogComponent} from './component/instution-dialog/institution-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    InstitutionComponent,
    InstitutionDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class InstitutionModule { }
