import {NgModule} from '@angular/core';
import {TransactionComponent} from "./transaction.component";
import {TransactionService} from "./service/transaction.service";
import {SharedModule} from "../../shared/module/shared.module";
import { WlistActionComponent } from './component/wlist-action/wlist-action.component';
import { BlistActionComponent } from './component/blist-action/blist-action.component';
import { TransDetailComponent } from './component/trans-detail/trans-detail.component';
import { FraudListActionComponent } from './component/fraud-list-action/fraud-list-action.component';
import {FraudFlagActionComponent} from "./component/fraud-flag-action/fraud-flag-action.component";

@NgModule({
  declarations: [
    TransactionComponent,
    WlistActionComponent,
    BlistActionComponent,
    TransDetailComponent,
    FraudListActionComponent,
    FraudFlagActionComponent
  ],
    exports: [
        TransactionComponent,
        TransDetailComponent
    ],
  imports: [
    SharedModule
  ],
  providers: [
    TransactionService
  ]
})
export class TransactionModule { }
