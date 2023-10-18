import {NgModule} from '@angular/core';
import { TransaksiComponent } from './transaksi.component';
import {SharedModule} from "../../shared/module/shared.module";
import { Transaksi1DialogComponent } from './component/transaksi-1-dialog/transaksi-1-dialog.component';
import { GenerateDialogComponent } from './component/generate-dialog/generate-dialog.component';
import { Transaksi2DialogComponent } from './component/transaksi-2-dialog/transaksi-2-dialog.component';
import { Transaksi3DialogComponent } from './component/transaksi-3-dialog/transaksi-3-dialog.component';
import { TransaksiImportComponent } from './component/transaksi-import/transaksi-import.component';
import { TransaksiExportComponent } from './component/transaksi-export/transaksi-export.component';
import {ClipboardModule} from 'ngx-clipboard'

@NgModule({
  declarations: [
    TransaksiComponent,
    Transaksi1DialogComponent,
    GenerateDialogComponent,
    Transaksi2DialogComponent,
    Transaksi3DialogComponent,
    TransaksiImportComponent,
    TransaksiExportComponent,
  ],

  imports: [
    SharedModule,
    ClipboardModule,
  ],
  exports: [
    TransaksiComponent
  ]
})
export class TransaksiModule { }
