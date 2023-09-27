import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FraudListComponent } from './fraud-list.component';
import {FraudListService} from "./service/fraud-list.service";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {RouterLink} from "@angular/router";
import {TableModule} from "primeng/table";
import {SharedModule} from "../../shared/module/shared.module";
import { FraudListDialogComponent } from './component/fraud-list-dialog/fraud-list-dialog.component';
import { FraudListValueDialogComponent } from './component/fraud-list-value-dialog/fraud-list-value-dialog.component';
import { FraudValueImportDialogComponent } from './component/fraud-value-import-dialog/fraud-value-import-dialog.component';

@NgModule({
  declarations: [
    FraudListComponent,
    FraudListDialogComponent,
    FraudListValueDialogComponent,
    FraudValueImportDialogComponent
  ],
    imports: [
        CommonModule,
        CardModule,
        DropdownModule,
        InputTextModule,
        MatButtonModule,
        MatMenuModule,
        RouterLink,
        SharedModule,
        TableModule
    ],
  exports: [
    FraudListComponent
  ],
  providers: [
    FraudListService
  ]
})
export class FraudListModule { }
