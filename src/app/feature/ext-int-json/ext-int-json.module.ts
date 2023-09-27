import {NgModule} from '@angular/core';
import {SharedModule} from "../../shared/module/shared.module";
import {ExtIntJsonComponent} from "./ext-int-json.component";
import { JsonDetailsComponent } from './component/json-details/json-details.component';
import { JsonDialogComponent } from './component/json-dialog/json-dialog.component';
import { JsonHeaderFieldComponent } from './component/json-header-field/json-header-field.component';
import { JsonBodyFieldComponent } from './component/json-body-field/json-body-field.component';
import { JsonGeneralSettingComponent } from './component/json-general-setting/json-general-setting.component';
import { JsonResponseCodeComponent } from './component/json-response-code/json-response-code.component';
import { JsonResponseCodeDialogComponent } from './component/json-response-code-dialog/json-response-code-dialog.component';
import { JsonTransactionTypeComponent } from './component/json-transaction-type/json-transaction-type.component';
import { JsonTransactionTypeDialogComponent } from './component/json-transaction-type-dialog/json-transaction-type-dialog.component';
import { JsonTransactionParamComponent } from './component/json-transaction-param/json-transaction-param.component';
import { JsonTransactionParamDialogComponent } from './component/json-transaction-param-dialog/json-transaction-param-dialog.component';
import { JsonEndpointDialogComponent } from './component/json-endpoint-dialog/json-endpoint-dialog.component';
import { JsonFieldConfigDialogComponent } from './component/json-field-config-dialog/json-field-config-dialog.component';
import { JsonBodyEndpointDialogComponent } from './component/json-body-endpoint-dialog/json-body-endpoint-dialog.component';
import { JsonBodyFieldConfigDialogComponent } from './component/json-body-field-config-dialog/json-body-field-config-dialog.component';
import { JsonActionFieldConfigDialogComponent } from './component/json-action-field-config-dialog/json-action-field-config-dialog.component';



@NgModule({
  declarations: [
    ExtIntJsonComponent,
    JsonDetailsComponent,
    JsonDialogComponent,
    JsonHeaderFieldComponent,
    JsonBodyFieldComponent,
    JsonGeneralSettingComponent,
    JsonResponseCodeComponent,
    JsonResponseCodeDialogComponent,
    JsonTransactionTypeComponent,
    JsonTransactionTypeDialogComponent,
    JsonTransactionParamComponent,
    JsonTransactionParamDialogComponent,
    JsonEndpointDialogComponent,
    JsonFieldConfigDialogComponent,
    JsonBodyEndpointDialogComponent,
    JsonBodyFieldConfigDialogComponent,
    JsonActionFieldConfigDialogComponent,
  ],
  imports: [
    SharedModule
  ]
})
export class ExtIntJsonModule { }
