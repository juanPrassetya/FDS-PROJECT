import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {tap} from "rxjs";
import {ExportReport, ImportReport, ReportDelete, ReportGenerate, ReportGet} from "./report.actions";
import {ReportService} from "../service/report.service";
import {NotificationService} from "../../../shared/services/notification.service";

export class ReportStateModel {
  reportData: any[] = [];
  reportList: any[] = []
}

@State<ReportStateModel>({
  name: 'reportState',
  defaults: {
    reportData: [],
    reportList: []
  }
})

@Injectable()
export class ReportState {

  constructor(
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static reportData(state: ReportStateModel) {
    return state.reportData;
  }

  @Selector()
  static reportList(state: ReportStateModel) {
    return state.reportList;
  }

  @Action(ReportGenerate, {cancelUncompleted: true})
  generateReport(ctx: StateContext<ReportStateModel>, {id, startDate, endDate}: ReportGenerate) {
    return this.reportService.generateReport(id, startDate, endDate).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          reportData: response.responseData,
        })
      }, error => {
        if (error.status != 401) this.notificationService.errorHttpNotification(error)
      })
    )
  }

  @Action(ReportGet, {cancelUncompleted: true})
  getReport(ctx: StateContext<ReportStateModel>) {
    return this.reportService.getReport().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          reportList: response.responseData,
        })
      }, error => {
        if (error.status != 401) this.notificationService.errorHttpNotification(error)
      })
    )
  }

  @Action(ReportDelete, {cancelUncompleted: true})
  deleteReport(ctx: StateContext<ReportStateModel>, {id}: ReportDelete) {
    return this.reportService.deleteReport(id).pipe(
      tap(response => {
        this.notificationService.successNotification(response.responseReason, response.responseMessage)
      }, error => {
        if (error.status != 401) this.notificationService.errorHttpNotification(error)
      })
    )
  }

  @Action(ImportReport, {cancelUncompleted: true}) importReport(
    ctx: StateContext<ReportStateModel>,
    {file, filename}: ImportReport
  ) {
    return this.reportService.importReport(file, filename).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

  @Action(ExportReport, {cancelUncompleted: true}) exportReport(
    ctx: StateContext<ReportStateModel>,
    {id, format, username, name}: ExportReport
  ) {
    return this.reportService.exportReport(id, format, username).pipe(
      tap(
        (response) => {
          let file: any
          var anchor = document.createElement("a");
          const currentDateTime = new Date().toLocaleString().replace(/[/:]/g, '-');

          if (format == 'pdf'){
            file = new Blob([response], { type: 'application/pdf' });
            anchor.download = `${name} - ${currentDateTime}.pdf`;
          } else {
            file = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' });
            anchor.download = `${name} - ${currentDateTime}.xls`;
          }

          anchor.href = URL.createObjectURL(file);
          anchor.click();
        },
        (error) => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    );
  }

}
