import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AccountDomain} from "../../domain/customer-domain/account.domain";

@Component({
  selector: 'app-acct-detail-dialog',
  templateUrl: './acct-detail-dialog.component.html',
  styleUrls: ['./acct-detail-dialog.component.css']
})
export class AcctDetailDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() data: Array<AccountDomain> = []
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  mapData: { key: string, value: any }[][] = [];

  constructor() {

  }

  ngOnInit() {
    if (this.data.length > 0) {
      this.data.forEach(v1 => {
        this.mapData.push([
          {
            key: 'Account Number',
            value: v1.accountNumber
          },
          {
            key: 'Account Type',
            value: v1.accountType
          },
          {
            key: 'Status',
            value: v1.accountStatus
          },
          {
            key: 'Currency',
            value: v1.currency
          }
        ])
      })
    }
    setTimeout(() => {
      this.isLoading.emit(false)
    }, 200)
  }

  ngOnDestroy() {
  }

  onDialogVisible() {
  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
