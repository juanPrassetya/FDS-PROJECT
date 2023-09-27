import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {ConfirmService} from "../../shared/services/confirm.service";
import {DateUtils} from "../../shared/utils/date.utils";
import {StringUtils} from "../../shared/utils/string.utils";
import {ReportService} from "./service/report.service";
import {ExportReport, ImportReport, ReportDelete, ReportGenerate, ReportGet} from "./state/report.actions";
import {ReportState} from "./state/report.state";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  @Select(ReportState.reportData) reportData$!: Observable<any>
  @Select(ReportState.reportList) reportList$!: Observable<any>

  @ViewChild('test', {static: false}) pdfTable!: ElementRef;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  selectedItem!: { reportName: string, reportId: number } | undefined
  selectedGroupItem!: { id: number, name: string } | undefined

  dummyAlertType = [
    {
      id: 1,
      name: 'Static Report',
      reportList: [
        {reportId: 1, reportName: 'Alert Statistic By Rule'},
        {reportId: 2, reportName: 'Alert Statistic Total'},
        {reportId: 3, reportName: 'User Activity History'},
        {reportId: 4, reportName: 'Decline Online Transaction'},
        {reportId: 5, reportName: 'Card on Recognized Fraudulent Terminal'},
        {reportId: 6, reportName: 'Rule Effectiveness'},
        {reportId: 7, reportName: 'Card Added to Stop List'},
      ]
    },
    {
      id: 2,
      name: 'Jasper Report',
      reportList: []
    }
  ]
  authorities: string[] = [];
  reportData: any[] = []

  isLoading: boolean = true

  visibleReportImportDialog: boolean = false

  visibleGenerateDialog: boolean = false
  visibleReport1: boolean = false
  visibleReport2: boolean = false
  visibleReport3: boolean = false
  visibleReport4: boolean = false
  visibleReport5: boolean = false
  visibleReport6: boolean = false
  visibleReport7: boolean = false

  constructor(
    private store$: Store,
    private action$: Actions,
    private confirmService: ConfirmService,
    private reportService: ReportService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.reportService.onGetReport()
    this.authorities = this.authService.getAuthorities();

    this.reportData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.reportData = data
    })

    this.reportList$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.dummyAlertType[1].reportList = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(ReportGenerate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.isLoading = false
        this.visibleGenerateDialog = false

        switch (this.selectedItem?.reportId) {
          case 1:
            this.visibleReport1 = true
            break

          case 2:
            this.visibleReport2 = true
            break

          case 3:
            this.visibleReport3 = true
            break

          case 4:
            this.visibleReport4 = true
            break

          case 5:
            this.visibleReport5 = true
            break

          case 6:
            this.visibleReport6 = true
            break

          case 7:
            this.visibleReport7 = true
            break
        }
      }
    )

    this.action$
      .pipe(
        ofActionSuccessful(ImportReport, ReportDelete),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.reportService.onGetReport()
      }
    )

    this.action$
      .pipe(
        ofActionErrored(ImportReport, ReportDelete),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.isLoading = false
      }
    )

    this.action$
      .pipe(
        ofActionCompleted(ReportGet, ReportGenerate, ExportReport),
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

  onGenerate() {
    if (this.selectedItem) {
      console.log(this.selectedGroupItem)
      this.visibleGenerateDialog = true
    }
  }

  onCloseGenerateDialog(stat: boolean) {
    this.visibleGenerateDialog = stat
  }

  onCloseReport1Dialog(stat: boolean) {
    this.visibleReport1 = stat
  }

  onCloseReport2Dialog(stat: boolean) {
    this.visibleReport2 = stat
  }

  onCloseReport3Dialog(stat: boolean) {
    this.visibleReport3 = stat
  }

  onCloseReport4Dialog(stat: boolean) {
    this.visibleReport4 = stat
  }

  onCloseReport5Dialog(stat: boolean) {
    this.visibleReport5 = stat
  }

  onCloseReport6Dialog(stat: boolean) {
    this.visibleReport6 = stat
  }

  onCloseReport7Dialog(stat: boolean) {
    this.visibleReport7 = stat
  }

  onClickedImportReport() {
    this.visibleReportImportDialog = true
  }

  onCloseImportReport(stat: boolean) {
    this.visibleReportImportDialog = stat
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onClickedDelete() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.reportService.onDeleteReport(Number(this.selectedItem?.reportId))
    })
  }

  isGenerateJDisable() {
    if (this.selectedItem == undefined) return true
    return Number(this.selectedItem?.reportId) <= 7
  }

  onSelectReport(group: any) {
    this.selectedGroupItem = group
  }

  onUnselectReport() {
    this.selectedGroupItem = undefined
  }
}
