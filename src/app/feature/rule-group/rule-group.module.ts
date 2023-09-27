import {NgModule} from '@angular/core';
import {RuleGroupComponent} from "./rule-group.component";
import {RuleGroupService} from "./service/rule-group.service";
import {SharedModule} from "../../shared/module/shared.module";
import { RuleGroupDetailsComponent } from './component/rule-group-details/rule-group-details.component';
import { RulesSummaryComponent } from './component/rules-summary/rules-summary.component';
import { ReactionSummaryComponent } from './component/reaction-summary/reaction-summary.component';
import { RuleGroupDialogComponent } from './component/rule-group-dialog/rule-group-dialog.component';
import {RuleModule} from "../rule/rule.module";
import {FraudReactionsModule} from "../fraud-reactions/fraud-reactions.module";

@NgModule({
  declarations: [
    RuleGroupComponent,
    RuleGroupDetailsComponent,
    RulesSummaryComponent,
    ReactionSummaryComponent,
    RuleGroupDialogComponent,
  ],
  exports: [
    RuleGroupComponent
  ],
  imports: [
    SharedModule,
    RuleModule,
    FraudReactionsModule
  ],
  providers: [
    RuleGroupService
  ]
})
export class RuleGroupModule { }
