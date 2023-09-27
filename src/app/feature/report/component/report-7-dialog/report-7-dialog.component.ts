import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Column, ExportColumn} from "../../domain/dummy-export.domain";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-report-7-dialog',
  templateUrl: './report-7-dialog.component.html',
  styleUrls: ['./report-7-dialog.component.css']
})
export class Report7DialogComponent implements OnInit, OnDestroy {
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
  name: string = 'Card Added to Stop List'

  ngOnInit() {
    this.cols = [
      {field: 'value', header: 'HPAN'},
      {field: 'blockingTime', header: 'Blocking Time'},
      {field: 'userId', header: 'User Id'},
      {field: 'username', header: 'Username'},
      {field: 'totalAlertHandled', header: 'Total Alert Handled'},
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
