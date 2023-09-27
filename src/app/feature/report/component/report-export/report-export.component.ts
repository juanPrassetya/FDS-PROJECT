import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DateUtils} from "../../../../shared/utils/date.utils";
import {ReportService} from "../../service/report.service";
import {Actions, ofActionCompleted, Select} from "@ngxs/store";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../../../user/domain/user.domain";
import {jsPDF} from "jspdf";
import * as FileSaver from "file-saver";
import {ExportReport} from "../../state/report.actions";

@Component({
  selector: 'app-report-export',
  templateUrl: './report-export.component.html',
  styleUrls: ['./report-export.component.css']
})
export class ReportExportComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() itemSelected!: any | undefined
  @Input() groupItemSelected!: any | undefined
  @Input() data!: any | undefined
  @Output() closeSelf = new EventEmitter<boolean>()

  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();

  userData: UserDomain | undefined
  isLoading: boolean = false

  constructor(
    private action$: Actions,
    private reportService: ReportService
  ) {
  }

  ngOnInit() {
    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionCompleted(ExportReport),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.isLoading = false
      }
    )
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onExportXLS() {
    if (this.itemSelected != undefined) {
      this.isLoading = true

      switch (this.groupItemSelected.id) {
        case 1:
          this.exportStaticExcel()
          break

        case 2:
          this.reportService.onExportReport(this.itemSelected?.reportId, 'xls', String(this.userData?.username), this.itemSelected.reportName)
          break
      }
    }
  }

  onExportPDF() {
    if (this.itemSelected != undefined) {
      this.isLoading = true

      switch (this.groupItemSelected.id) {
        case 1:
          this.exportPStaticPdf()
          break

        case 2:
          this.reportService.onExportReport(this.itemSelected?.reportId, 'pdf', String(this.userData?.username), this.itemSelected.reportName)
          break
      }
    }
  }

  exportPStaticPdf() {
    const doc = new jsPDF('p', 'px', 'a4');

    const title = this.itemSelected.name; // Specify the title text
    const exportColumns = this.itemSelected.exportColumns; // Assuming you have the column headers in exportColumns
    const reportData: any[] = this.itemSelected.reportData.data; // Assuming you have the data in reportData.data

    // Extract column titles from exportColumns
    const columnTitles = exportColumns.map((column: any) => column.title);

    // Convert reportData to array format
    const tableData = reportData.map(data => exportColumns.map((column: any) => data[column.dataKey]));

    // Set the title font size and text alignment
    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, {align: 'center'});

    const subtext = `Date From: ${this.itemSelected.reportData.fromDate}     Date To: ${this.itemSelected.reportData.toDate}`;
    doc.setFontSize(10);
    doc.text(subtext, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    // Generate the table below the title
    (doc as any).autoTable({
      startY: 50, // Specify the Y position where the table should start
      head: [columnTitles],
      body: tableData,
    });

    const currentDateTime = new Date().toLocaleString().replace(/[/:]/g, '-');
    doc.save(`${this.itemSelected.name} - ${currentDateTime}.pdf`);
    this.isLoading = false
  }

  exportStaticExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.itemSelected.reportData.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([excelBuffer], {
        type: EXCEL_TYPE
      });

      const currentDateTime = new Date().toLocaleString().replace(/[/:]/g, '-');
      FileSaver.saveAs(data, `${this.itemSelected.name} - ${currentDateTime}.${EXCEL_EXTENSION}`);
      this.isLoading = false
    });
  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
