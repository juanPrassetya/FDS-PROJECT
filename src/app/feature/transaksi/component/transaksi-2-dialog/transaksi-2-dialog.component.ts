import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-transaksi-2-dialog',
  templateUrl: './transaksi-2-dialog.component.html',
  styleUrls: ['./transaksi-2-dialog.component.css']
})
export class Transaksi2DialogComponent implements OnInit, OnDestroy {
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
  name: string = 'Alert Statistic Total'

  ngOnInit() {
    this.cols = [
      {field: 'alertDate', header: 'Alert Date'},
      {field: 'totalDate', header: 'Total Date'},
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
