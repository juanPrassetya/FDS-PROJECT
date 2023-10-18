import {NgModule} from '@angular/core';
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {NgxsDispatchPluginModule} from "@ngxs-labs/dispatch-decorator";
import {NgxsModule} from "@ngxs/store";
import {RuleState} from "../../feature/rule/state/rule.state";
import {TransactionState} from "../../feature/transaction/state/transaction.state";
import {UserGroupState} from "../../feature/user-group/state/user-group.state";
import {TransParamState} from "../../feature/transaction-parameter/state/trans-param.state";
import {AuthState} from "../auth/state/auth.state";
import {ResetPasswordState} from "../../feature/reset-password/state/reset-password.state";
import {WhiteListState} from "../../feature/white-list/state/white-list.state";
import {BlackListState} from "../../feature/black-list/state/black-list.state";
import {FraudListState} from "../../feature/fraud-list/state/fraud-list.state";
import {FraudListValueState} from "../../feature/fraud-list-value/state/fraud-list-value.state";
import {RuleGroupState} from "../../feature/rule-group/state/rule-group.state";
import {FraudListTypeState} from "../../feature/fraud-list-type/state/fraud-list-type.state";
import {AlertInvestigationState} from "../../feature/alert-investigation/state/alert-investigation.state";
import {UserState} from "../../feature/user/state/user.state";
import {FraudReactionsState} from "../../feature/fraud-reactions/state/fraud-reactions.state";
import {RespCodeMappingState} from "../../feature/resp-code-mapping/state/resp-code-mapping.state";
import {ResponseCodeState} from "../../feature/response-code/state/response-code.state";
import {TransactionTypeState} from "../../feature/transaction-type/state/transaction-type.state";
import {ExtIntISO8583State} from "../../feature/ext-int-iso8583/state/ext-int-iso8583.state";
import { AidParameterState } from 'src/app/feature/aid-parameter/state/aid-parameter.state';
import {NotifTemplateState} from "../../feature/notification-template/state/notif-template.state";
import {NotifTypeState} from "../../feature/notification-type/state/notif-type.state";
import {RecipientSetupState} from "../../feature/recipient-setup/state/recipient-setup.state";
import {RecipientGroupState} from "../../feature/recipient-group/state/recipient-group.state";
import {InstitutionState} from "../../feature/institution/state/institution.state";
import {UserAuditState} from "../../feature/user-audit/state/user-audit.state";
import {UserRoleState} from "../../feature/user-role/state/user-role.state";
import {HeaderState} from "../component/header/state/header.state";
import {DashboardState} from "../../feature/dashboard/state/dashboard.state";
import {ReportState} from "../../feature/report/state/report.state";
import {ExtIntJSONState} from "../../feature/ext-int-json/state/ext-int-json.state";
import { PanState } from 'src/app/feature/pan/state/pan.state';
import { MerchantState } from 'src/app/feature/merchant/state/merchant.state';
import { KeysState } from 'src/app/feature/keys/state/keys.state';
import { MessagesetState } from 'src/app/feature/messageset/state/messageset.state';
import { ConnectsetState } from 'src/app/feature/connectset/state/connectset.state';
import { ManagementState } from 'src/app/feature/management/state/management.state';
import { MappingState } from 'src/app/feature/mapping/state/mapping.state';
import { RescodeState } from 'src/app/feature/rescode/state/rescode.state';
import { ActionState } from 'src/app/feature/action/state/action.state';
import { TransaksiState } from 'src/app/feature/transaksi/state/transaksi.state';


const stateModules = [
  NgxsLoggerPluginModule.forRoot(),
  NgxsReduxDevtoolsPluginModule.forRoot(),
  NgxsDispatchPluginModule.forRoot(),
  NgxsModule.forRoot([
    RuleState,
    TransactionState,
    UserGroupState,
    TransParamState,
    AuthState,
    ResetPasswordState,
    WhiteListState,
    BlackListState,
    FraudListState,
    FraudListValueState,
    FraudListTypeState,
    RuleGroupState,
    AlertInvestigationState,
    UserState,
    FraudReactionsState,
    RespCodeMappingState,
    ResponseCodeState,
    TransactionTypeState,
    ExtIntISO8583State,
    AidParameterState,
    NotifTemplateState,
    NotifTypeState,
    RecipientSetupState,
    RecipientGroupState,
    InstitutionState,
    PanState,
    MerchantState,
    KeysState,
    MessagesetState,
    ConnectsetState,
    ManagementState,
    MappingState,
    RescodeState, 
    ActionState,
    UserAuditState,
    UserRoleState,
    HeaderState,
    DashboardState,
    ReportState,
    TransaksiState,
    ExtIntJSONState
  ])
]
@NgModule({
  declarations: [],
  imports: [stateModules],
  exports: [stateModules]
})
export class NgxsStateModule { }
