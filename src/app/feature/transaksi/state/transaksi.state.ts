import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {tap} from "rxjs";
import {ExportTransaksi, ImportTransaksi, TransaksiDelete, TransaksiGenerate, TransaksiGet} from "./transaksi.actions";
import { TransaksiService } from "../service/transaksi.service";
import {NotificationService} from "../../../shared/services/notification.service";

export class TransaksiStateModel {
  transaksiData: any[] = [];
  transaksiList: any[] = []
}

@State<TransaksiStateModel>({
  name: 'transaksiState',
  defaults: {
    transaksiData: [],
    transaksiList: []
  }
})

@Injectable()
export class TransaksiState {

  constructor(
    private transaksiService: TransaksiService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static transaksiData(state: TransaksiStateModel) {
    return state.transaksiData;
  }

  @Selector()
  static transaksiList(state: TransaksiStateModel) {
    return state.transaksiList;
  }

  @Action(TransaksiGenerate, {cancelUncompleted: true})
  generateTransaksi(ctx: StateContext<TransaksiStateModel>, {id, startDate, endDate}: TransaksiGenerate) {
    return this.transaksiService.generateTransaksi(id, startDate, endDate).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          transaksiData: response.responseData,
        })
      }, error => {
        if (error.status != 401) this.notificationService.errorHttpNotification(error)
      })
    )
  }

  @Action(TransaksiGet, {cancelUncompleted: true})
  getTransaksi(ctx: StateContext<TransaksiStateModel>) {
    return this.transaksiService.getTransaksi().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          transaksiList: response.responseData,
        })
      }, error => {
        if (error.status != 401) this.notificationService.errorHttpNotification(error)
      })
    )
  }

  @Action(TransaksiDelete, {cancelUncompleted: true})
  deleteTransaksi(ctx: StateContext<TransaksiStateModel>, {id}: TransaksiDelete) {
    return this.transaksiService.deleteTransaksi(id).pipe(
      tap(response => {
        this.notificationService.successNotification(response.responseReason, response.responseMessage)
      }, error => {
        if (error.status != 401) this.notificationService.errorHttpNotification(error)
      })
    )
  }

  @Action(ImportTransaksi, {cancelUncompleted: true}) importTransaksi(
    ctx: StateContext<TransaksiStateModel>,
    {file, filename}: ImportTransaksi
  ) {
    return this.transaksiService.importTransaksi(file, filename).pipe(
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

  @Action(ExportTransaksi, {cancelUncompleted: true}) exportTransaksi(
    ctx: StateContext<TransaksiStateModel>,
    {id, format, username, name}: ExportTransaksi
  ) {
    return this.transaksiService.exportTransaksi(id, format, username).pipe(
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
