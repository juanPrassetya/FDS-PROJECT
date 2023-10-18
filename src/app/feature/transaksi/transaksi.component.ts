import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {ConfirmService} from "../../shared/services/confirm.service";
import {DateUtils} from "../../shared/utils/date.utils";
import {StringUtils} from "../../shared/utils/string.utils";
import { TransaksiService } from './service/transaksi.service';
import {ExportTransaksi, ImportTransaksi, TransaksiDelete, TransaksiGenerate, TransaksiGet} from "./state/transaksi.actions";
import { TransaksiState } from './state/transaksi.state';
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.css']
})
export class TransaksiComponent implements OnInit, OnDestroy {
  @Select(TransaksiState.transaksiData) transaksiData$!: Observable<any>
  @Select(TransaksiState.transaksiList) transaksiList$!: Observable<any>

  @ViewChild('test', {static: false}) pdfTable!: ElementRef;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  selectedItem!: { transaksiName: string, transaksiId: number } | undefined
  selectedGroupItem!: { id: number, name: string } | undefined

  dummyAlertType = [
    {
      id: 1,
      name: 'Aletr Statistic By Rule',
      transaksiList: [
        {transaksiId: 1, transaksiName: 'Alert Statistic By Rule'},
        {transaksiId: 2, transaksiName: 'Alert Statistic Total'},
        {transaksiId: 3, transaksiName: 'User Activity History'},

      ]
    },
    {
      id: 2,
      name: 'Jasper Transaksi',
      transaksiList: []
    }
  ]
  authorities: string[] = [];
  transaksiData: any[] = []

  isLoading: boolean = true

  visibleTransaksiImportDialog: boolean = false

  visibleGenerateDialog: boolean = false
  visibleTransaksi1: boolean = false
  visibleTransaksi2: boolean = false
  visibleTransaksi3: boolean = false
  

  constructor(
    private store$: Store,
    private action$: Actions,
    private confirmService: ConfirmService,
    private transaksiService: TransaksiService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.transaksiService.onGetTransaksi()
    this.authorities = this.authService.getAuthorities();

    this.transaksiData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.transaksiData = data
    })

    this.transaksiList$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.dummyAlertType[1].transaksiList = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(TransaksiGenerate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.isLoading = false
        this.visibleGenerateDialog = false

        switch (this.selectedItem?.transaksiId) {
          case 1:
            this.visibleTransaksi1 = true
            break

          case 2:
            this.visibleTransaksi2 = true
            break

          case 3:
            this.visibleTransaksi3 = true
            break

         
        }
      }
    )

    this.action$
      .pipe(
        ofActionSuccessful(ImportTransaksi, TransaksiDelete),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.transaksiService.onGetTransaksi()
      }
    )

    this.action$
      .pipe(
        ofActionErrored(ImportTransaksi, TransaksiDelete),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.isLoading = false
      }
    )

    this.action$
      .pipe(
        ofActionCompleted(TransaksiGet, TransaksiGenerate, ExportTransaksi),
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

  onCloseTransaksi1Dialog(stat: boolean) {
    this.visibleTransaksi1 = stat
  }

  onCloseTransaksi2Dialog(stat: boolean) {
    this.visibleTransaksi2 = stat
  }

  onCloseTransaksi3Dialog(stat: boolean) {
    this.visibleTransaksi3 = stat
  }

 

  onClickedImportTransaksi() {
    this.visibleTransaksiImportDialog = true
  }

  onCloseImportTransaksi(stat: boolean) {
    this.visibleTransaksiImportDialog = stat
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onClickedDelete() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.transaksiService.onDeleteTransaksi(Number(this.selectedItem?.transaksiId))
    })
  }

  isGenerateJDisable() {
    if (this.selectedItem == undefined) return true
    return Number(this.selectedItem?.transaksiId) <= 7
  }

  onSelectTransaksi(group: any) {
    this.selectedGroupItem = group
  }

  onUnselectTransaksi() {
    this.selectedGroupItem = undefined
  }
}
