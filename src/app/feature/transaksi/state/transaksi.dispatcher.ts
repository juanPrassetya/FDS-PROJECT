import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ExportTransaksi, ImportTransaksi, TransaksiDelete, TransaksiGenerate, TransaksiGet} from "./transaksi.actions";

@Injectable({
  providedIn: 'root'
})
export class TransaksiDispatcher {
  @Dispatch()
  public _GenerateTransaksi(id: number, startDate: string, endDate: string) {
    return new TransaksiGenerate(id, startDate, endDate);
  }

  @Dispatch()
  public _TransaksiGet() {
    return new TransaksiGet();
  }

  @Dispatch()
  public _TransaksiDelete(id: number) {
    return new TransaksiDelete(id);
  }

  @Dispatch()
  public _ImportTransaksi(file: any, filename: string) {
    return new ImportTransaksi(file, filename);
  }

  @Dispatch()
  public _ExportTransaksi(id: number, format: string, username: string, name: string) {
    return new ExportTransaksi(id, format, username, name);
  }
}
