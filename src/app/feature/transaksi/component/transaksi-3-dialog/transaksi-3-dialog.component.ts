import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-transaksi-3-dialog',
  templateUrl: './transaksi-3-dialog.component.html',
  styleUrls: ['./transaksi-3-dialog.component.css']
})
export class Transaksi3DialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() transaksiData: any
  @Output() closeSelf = new EventEmitter<boolean>()

  cols: Column[] = [

    {
      field: 'code',
      header: 'Code'
    },
    {
      field: 'name',
      header: 'Name'
    },
  ]

  exportColumns!: ExportColumn[];

  visibleExportDialog: boolean = false
  name: string = 'User Activity History'

  ngOnInit() {
    this.cols = [
      {field: 'username', header: 'Username'},
      {field: 'alertProcessedByUser', header: 'Alert Processed by User'},
      {field: 'cardMarkedFraudulentByUser', header: 'Card Marked Fraudulent by User'},
    ];
    this.exportColumns = this.cols.map((col) => ({title: col.header, dataKey: col.field}));

  }

  ngOnDestroy() {
  }

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }

  onGenerate() {
    this.visibleExportDialog = true
  }

  onCloseExport(stat: boolean) {
    this.visibleExportDialog = stat
  }
}
