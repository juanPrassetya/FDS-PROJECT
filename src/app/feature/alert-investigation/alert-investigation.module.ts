import {NgModule} from '@angular/core';
import {AlertInvestigationComponent} from './alert-investigation.component';
import {SharedModule} from "../../shared/module/shared.module";
import {AlertInvestigationService} from "./service/alert-investigation.service";
import { TransactionSummaryComponent } from './component/transaction-summary/transaction-summary.component';
import { CaseManagementComponent } from './component/case-management/case-management.component';
import { AlertDetailsComponent } from './component/alert-details/alert-details.component';
import { InvestigationHistoryComponent } from './component/investigation-history/investigation-history.component';
import { AlertCaseDetailsComponent } from './component/alert-case-details/alert-case-details.component';
import { TransactionSumDetailsComponent } from './component/transaction-sum-details/transaction-sum-details.component';
import {TransactionModule} from "../transaction/transaction.module";
import { ClassifyDialogComponent } from './component/classify-dialog/classify-dialog.component';
import { ActionDialogComponent } from './component/action-dialog/action-dialog.component';
import { CardDetailDialogComponent } from './component/card-detail-dialog/card-detail-dialog.component';
import { AcctDetailDialogComponent } from './component/acct-detail-dialog/acct-detail-dialog.component';
import { PersonDetailDialogComponent } from './component/person-detail-dialog/person-detail-dialog.component';
import { RuleDetailDialogComponent } from './component/rule-detail-dialog/rule-detail-dialog.component';


@NgModule({
  declarations: [
    AlertInvestigationComponent,
    TransactionSummaryComponent,
    CaseManagementComponent,
    AlertDetailsComponent,
    InvestigationHistoryComponent,
    AlertCaseDetailsComponent,
    TransactionSumDetailsComponent,
    ClassifyDialogComponent,
    ActionDialogComponent,
    CardDetailDialogComponent,
    AcctDetailDialogComponent,
    PersonDetailDialogComponent,
    RuleDetailDialogComponent
  ],
  exports: [
    AlertInvestigationComponent
  ],
  imports: [
    SharedModule,
    TransactionModule
  ],
  providers: [
    AlertInvestigationService
  ]
})
export class AlertInvestigationModule {
}
