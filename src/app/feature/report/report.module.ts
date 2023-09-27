import {NgModule} from '@angular/core';
import {ReportComponent} from "./report.component";
import {SharedModule} from "../../shared/module/shared.module";
import { Report1DialogComponent } from './component/report-1-dialog/report-1-dialog.component';
import { GenerateDialogComponent } from './component/generate-dialog/generate-dialog.component';
import { Report2DialogComponent } from './component/report-2-dialog/report-2-dialog.component';
import { Report3DialogComponent } from './component/report-3-dialog/report-3-dialog.component';
import { Report4DialogComponent } from './component/report-4-dialog/report-4-dialog.component';
import { Report5DialogComponent } from './component/report-5-dialog/report-5-dialog.component';
import { Report6DialogComponent } from './component/report-6-dialog/report-6-dialog.component';
import { Report7DialogComponent } from './component/report-7-dialog/report-7-dialog.component';
import {ReportImportComponent} from "./component/report-import/report-import.component";
import { ReportExportComponent } from './component/report-export/report-export.component';

@NgModule({
  declarations: [
    ReportComponent,
    Report1DialogComponent,
    GenerateDialogComponent,
    Report2DialogComponent,
    Report3DialogComponent,
    Report4DialogComponent,
    Report5DialogComponent,
    Report6DialogComponent,
    Report7DialogComponent,
    ReportImportComponent,
    ReportExportComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    ReportComponent
  ]
})
export class ReportModule { }
