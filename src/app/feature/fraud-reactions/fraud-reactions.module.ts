import {NgModule} from '@angular/core';
import {FraudReactionsComponent} from './fraud-reactions.component';
import {FraudReactionsService} from "./service/fraud-reactions.service";
import {GroupReactionsDialogComponent} from './component/group-reactions-dialog/group-reactions-dialog.component';
import {RuleReactionsDialogComponent} from './component/rule-reactions-dialog/rule-reactions-dialog.component';
import {BlackReactionsDialogComponent} from './component/black-reactions-dialog/black-reactions-dialog.component';
import {WhiteReactionsDialogComponent} from './component/white-reactions-dialog/white-reactions-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";
import {FraudReactionsDetailComponent} from './component/fraud-reactions-detail/fraud-reactions-detail.component';


@NgModule({
    declarations: [
        FraudReactionsComponent,
        GroupReactionsDialogComponent,
        RuleReactionsDialogComponent,
        BlackReactionsDialogComponent,
        WhiteReactionsDialogComponent,
        FraudReactionsDetailComponent
    ],
    imports: [
        SharedModule,
    ],
  exports: [
    GroupReactionsDialogComponent,
    FraudReactionsDetailComponent
  ],
    providers: [
        FraudReactionsService
    ]
})
export class FraudReactionsModule { }
