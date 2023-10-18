import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import { TransaksiDispatcher } from '../state/transaksi.dispatcher';

@Injectable({
  providedIn: 'root'
})
export class TransaksiService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private transaksiDispatcher: TransaksiDispatcher
  ) { }

  generateTransaksi(id: number, startDate: string, endDate: string) {
    const params = new HttpParams()
      .set('transaksiType', id)
      .append('startDate', startDate)
      .append('endDate', endDate);

    return this.http.get<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.GENERATE_TRANSAKSI_PATH}`, {params});
  }

  getTransaksi() {
    return this.http.get<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.TRANSAKSI_GET_PATH}`);
  }

  importTransaksi(file: any, filename: string) {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('filename', filename);
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.IMPORT_TRANSAKSI_PATH}`,
      formData
    );
  }

  exportTransaksi(id: number, format: string, username: string) {
    const params = new HttpParams()
      .set('format', format)
      .append('username', username)

    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };

    return this.http.get<any>(
      `${this.apiUrl}/${RoutePathEnum.EXPORT_TRANSAKSI_PATH}/${id}`,
      { params, responseType: 'arraybuffer' as 'json'}
    );
  }

  deleteTransaksi(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANSAKSI_DELETE_PATH}/` + id
    );
  }

  onGenerateTransaksi(id: number, startDate: string, endDate: string) {
    this.transaksiDispatcher._GenerateTransaksi(id, startDate, endDate)
  }

  onGetTransaksi() {
    this.transaksiDispatcher._TransaksiGet()
  }

  onDeleteTransaksi(id: number) {
    this.transaksiDispatcher._TransaksiDelete(id)
  }

  onImportTransaksi(file: any, filename: string) {
    this.transaksiDispatcher._ImportTransaksi(file, filename);
  }

  onExportTransaksi(id: number, format: string, username: string, name: string) {
    this.transaksiDispatcher._ExportTransaksi(id, format, username, name);
  }
}
