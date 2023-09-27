import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {ReportDispatcher} from "../state/report.dispatcher";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private reportDispatcher: ReportDispatcher
  ) { }

  generateReport(id: number, startDate: string, endDate: string) {
    const params = new HttpParams()
      .set('reportType', id)
      .append('startDate', startDate)
      .append('endDate', endDate);

    return this.http.get<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.GENERATE_REPORT_PATH}`, {params});
  }

  getReport() {
    return this.http.get<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.REPORT_GET_PATH}`);
  }

  importReport(file: any, filename: string) {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('filename', filename);
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.IMPORT_REPORT_PATH}`,
      formData
    );
  }

  exportReport(id: number, format: string, username: string) {
    const params = new HttpParams()
      .set('format', format)
      .append('username', username)

    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };

    return this.http.get<any>(
      `${this.apiUrl}/${RoutePathEnum.EXPORT_REPORT_PATH}/${id}`,
      { params, responseType: 'arraybuffer' as 'json'}
    );
  }

  deleteReport(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.REPORT_DELETE_PATH}/` + id
    );
  }

  onGenerateReport(id: number, startDate: string, endDate: string) {
    this.reportDispatcher._GenerateReport(id, startDate, endDate)
  }

  onGetReport() {
    this.reportDispatcher._ReportGet()
  }

  onDeleteReport(id: number) {
    this.reportDispatcher._ReportDelete(id)
  }

  onImportReport(file: any, filename: string) {
    this.reportDispatcher._ImportReport(file, filename);
  }

  onExportReport(id: number, format: string, username: string, name: string) {
    this.reportDispatcher._ExportReport(id, format, username, name);
  }
}
