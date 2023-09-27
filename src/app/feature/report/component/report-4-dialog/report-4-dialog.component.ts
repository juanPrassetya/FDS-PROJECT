import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-report-4-dialog',
  templateUrl: './report-4-dialog.component.html',
  styleUrls: ['./report-4-dialog.component.css']
})
export class Report4DialogComponent implements OnInit, OnDestroy {
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
  name: string = 'Decline Online Transaction'

  ngOnInit() {
    this.cols = [
      {field: 'authDate', header: 'Auth Date'},
      {field: 'respCode', header: 'Response Code'},
      {field: 'respCodeDesc', header: 'Repsonse Code Desc'},
      {field: 'currency', header: 'Currency'},
      {field: 'total', header: 'Total'},
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
