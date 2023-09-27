import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-report-5-dialog',
  templateUrl: './report-5-dialog.component.html',
  styleUrls: ['./report-5-dialog.component.css']
})
export class Report5DialogComponent implements OnInit, OnDestroy {
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
  name: string = 'Card Had Trans on Fraudulent Terminal'

  ngOnInit() {
    this.cols = [
      {field: 'hpan', header: 'HPAN'},
      {field: 'utrnno', header: 'Utrnno'},
      {field: 'terminalId', header: 'Terminal Id'},
      {field: 'terminalDate', header: 'Terminal Date'},
      {field: 'amount', header: 'Amount'},
      {field: 'respCode', header: 'Response Code'},
      {field: 'currency', header: 'Currency'},
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
