import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-report-6-dialog',
  templateUrl: './report-6-dialog.component.html',
  styleUrls: ['./report-6-dialog.component.css']
})
export class Report6DialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() reportData: any
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
  name: string = 'Rule Effectiveness'

  ngOnInit() {
    this.cols = [
      {field: 'ruleId', header: 'Rule Id'},
      {field: 'ruleName', header: 'Rule Name'},
      {field: 'totalFraudTransTriggered', header: 'Total Fraud Trans Triggered'},
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
