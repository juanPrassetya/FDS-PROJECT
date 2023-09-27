import {NgModule} from '@angular/core';
import {ExtIntISO8583Component} from './ext-int-iso8583.component';
import {ExtIntISO8583Service} from "./service/ext-int-iso8583.service";
import {SharedModule} from "../../shared/module/shared.module";
import { Iso8583DetailsComponent } from './component/iso8583-details/iso8583-details.component';
import { Iso8583DialogComponent } from './component/iso8583-dialog/iso8583-dialog.component';
import { Iso8583GeneralSettingComponent } from './component/iso8583-general-setting/iso8583-general-setting.component';
import { Iso8583HeaderFieldComponent } from './component/iso8583-header-field/iso8583-header-field.component';
import { Iso8583BodyFieldComponent } from './component/iso8583-body-field/iso8583-body-field.component';
import { Iso8583HeaderFieldDialogComponent } from './component/iso8583-header-field-dialog/iso8583-header-field-dialog.component';
import { Iso8583BodyFieldDialogComponent } from './component/iso8583-body-field-dialog/iso8583-body-field-dialog.component';
import { Iso8583CbodyFieldDialogComponent } from './component/iso8583-cbody-field-dialog/iso8583-cbody-field-dialog.component';
import { Iso8583TransactionParamComponent } from './component/iso8583-transaction-param/iso8583-transaction-param.component';
import { Iso8583TransactionParamDialogComponent } from './component/iso8583-transaction-param-dialog/iso8583-transaction-param-dialog.component';
import { Iso8583ResponseCodeComponent } from './component/iso8583-response-code/iso8583-response-code.component';
import { Iso8583ResponseCodeDialogComponent } from './component/iso8583-response-code-dialog/iso8583-response-code-dialog.component';
import { Iso8583TransactionTypeComponent } from './component/iso8583-transaction-type/iso8583-transaction-type.component';
import { Iso8583TransactionTypeDialogComponent } from './component/iso8583-transaction-type-dialog/iso8583-transaction-type-dialog.component';


@NgModule({
  declarations: [
    ExtIntISO8583Component,
    Iso8583DetailsComponent,
    Iso8583DialogComponent,
    Iso8583GeneralSettingComponent,
    Iso8583HeaderFieldComponent,
    Iso8583BodyFieldComponent,
    Iso8583HeaderFieldDialogComponent,
    Iso8583BodyFieldDialogComponent,
    Iso8583CbodyFieldDialogComponent,
    Iso8583TransactionParamComponent,
    Iso8583TransactionParamDialogComponent,
    Iso8583ResponseCodeComponent,
    Iso8583ResponseCodeDialogComponent,
    Iso8583TransactionTypeComponent,
    Iso8583TransactionTypeDialogComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    ExtIntISO8583Service
  ]
})
export class ExtIntISO8583Module { }
