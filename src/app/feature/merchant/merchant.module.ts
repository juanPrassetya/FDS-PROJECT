import {NgModule} from '@angular/core';
import { MerchantComponent } from './merchant.component';
import { MerchantDialogComponent } from './component/instution-dialog/merchant-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";


@NgModule({
  declarations: [
    MerchantComponent,
    MerchantDialogComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MerchantModule { }
