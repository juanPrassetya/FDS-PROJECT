import {NgModule} from '@angular/core';
import {RuleComponent} from "./rule.component";
import {RulecrudComponent} from './component/rulecrud/rulecrud.component';
import {RuleService} from "./services/rule.service";
import {SharedModule} from "../../shared/module/shared.module";
import {RuleDetailComponent} from './component/rule-detail/rule-detail.component';
import { LogicalDialogComponent } from './component/logical-dialog/logical-dialog.component';
import { ConstantDialogComponent } from './component/constant-dialog/constant-dialog.component';
import { ListDialogComponent } from './component/list-dialog/list-dialog.component';
import { ArithmeticDialogComponent } from './component/arithmetic-dialog/arithmetic-dialog.component';
import { LimitDialogComponent } from './component/limit-dialog/limit-dialog.component';
import { AggregateDialogComponent } from './component/aggregate-dialog/aggregate-dialog.component';
import { AttributeDialogComponent } from './component/attribute-dialog/attribute-dialog.component';
import { ExistingAggregateDialogComponent } from './component/existing-aggregate-dialog/existing-aggregate-dialog.component';
import { SetStatusDialogComponent } from './component/set-status-dialog/set-status-dialog.component';
import { ApprovalDialogComponent } from './component/approval-dialog/approval-dialog.component';
import { ImportRuleDialogComponent } from './component/import-rule-dialog/import-rule-dialog.component';
import { ExportRuleDialogComponent } from './component/export-rule-dialog/export-rule-dialog.component';

@NgModule({
  declarations: [
    RuleComponent,
    RulecrudComponent,
    RuleDetailComponent,
    LogicalDialogComponent,
    ConstantDialogComponent,
    ListDialogComponent,
    ArithmeticDialogComponent,
    LimitDialogComponent,
    AggregateDialogComponent,
    AttributeDialogComponent,
    ExistingAggregateDialogComponent,
    SetStatusDialogComponent,
    ApprovalDialogComponent,
    ImportRuleDialogComponent,
    ExportRuleDialogComponent,
  ],
    exports: [
        RuleComponent,
        RulecrudComponent,
        RuleDetailComponent
    ],
  imports: [
    SharedModule
  ],
  providers: [
    RuleService
  ]
})
export class RuleModule { }
