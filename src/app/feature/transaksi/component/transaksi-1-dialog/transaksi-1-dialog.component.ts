import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import 'jspdf-autotable';

@Component({
  selector: 'app-transaksi-1-dialog',
  templateUrl: './transaksi-1-dialog.component.html',
  styleUrls: ['./transaksi-1-dialog.component.css']
})
export class Transaksi1DialogComponent implements OnInit, OnDestroy {
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
  name: string = 'Alert Statistic by Rule'

  ngOnInit() {
    this.cols = [
      {field: 'ruleId', header: 'Rule Id'},
      {field: 'ruleName', header: 'Rule Name'},
      {field: 'totalAlerts', header: 'Total Alert'},
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
