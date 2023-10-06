import {NgModule} from '@angular/core';
import { Tran2Component } from './tran2.component';
import { Tran2DialogComponent } from './component/tran2-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    Tran2Component,
    Tran2DialogComponent,
    
  ],
  imports: [
    SharedModule,
    
  ]
})
export class Tran2Module { }
