import {NgModule} from '@angular/core';
import {DashboardComponent} from "./dashboard.component";
import {SharedModule} from "../../shared/module/shared.module";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  imports: [
    SharedModule
  ]
})
export class DashboardModule { }
