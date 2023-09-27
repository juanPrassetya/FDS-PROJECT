import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ExportReport, ImportReport, ReportDelete, ReportGenerate, ReportGet} from "./report.actions";

@Injectable({
  providedIn: 'root'
})
export class ReportDispatcher {
  @Dispatch()
  public _GenerateReport(id: number, startDate: string, endDate: string) {
    return new ReportGenerate(id, startDate, endDate);
  }

  @Dispatch()
  public _ReportGet() {
    return new ReportGet();
  }

  @Dispatch()
  public _ReportDelete(id: number) {
    return new ReportDelete(id);
  }

  @Dispatch()
  public _ImportReport(file: any, filename: string) {
    return new ImportReport(file, filename);
  }

  @Dispatch()
  public _ExportReport(id: number, format: string, username: string, name: string) {
    return new ExportReport(id, format, username, name);
  }
}
