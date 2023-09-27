import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DateUtils} from "../../../../shared/utils/date.utils";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {CardDomain} from "../../domain/customer-domain/card.domain";

@Component({
  selector: 'app-card-detail-dialog',
  templateUrl: './card-detail-dialog.component.html',
  styleUrls: ['./card-detail-dialog.component.css']
})
export class CardDetailDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() data: Array<CardDomain> = []
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  mapData: { key: string, value: any }[][] = [];

  constructor() {

  }

  ngOnInit() {
    if (this.data.length > 0) {
      this.data.forEach(v1 => {
        this.mapData.push([
          {
            key: 'Card Number',
            value: v1.cardNumber
          },
          {
            key: 'Iss Date',
            value: v1.cardIssDate
          },
          {
            key: 'Start Date',
            value: v1.cardStartDate
          },
          {
            key: 'Exp Date',
            value: v1.expirationDate
          },
          {
            key: 'Instance',
            value: v1.instanceId
          },
          {
            key: 'Preceding Instance',
            value: v1.precedingInstanceId
          },
          {
            key: 'Seq Number',
            value: v1.sequentialNumber
          },
          {
            key: 'Status',
            value: v1.cardStatus
          },
          {
            key: 'State',
            value: v1.cardState
          },
          {
            key: 'Category',
            value: v1.category
          },
          {
            key: 'PVV',
            value: v1.pvv
          },
          {
            key: 'PIN Offset',
            value: v1.pinOffset
          },
          {
            key: 'Pin Update Flag',
            value: v1.pinUpdateFlag
          },
          {
            key: 'Card Type',
            value: v1.cardTypeId
          },
          {
            key: 'Previous Card Number',
            value: v1.prevCardNumber
          },
          {
            key: 'Agent Number',
            value: v1.agentNumber
          },
          {
            key: 'Agent Name',
            value: v1.agentName
          },
          {
            key: 'Product Number',
            value: v1.productNumber
          },
          {
            key: 'Product Name',
            value: v1.productName
          },
          {
            key: 'Company Name',
            value: v1.companyName
          },
          {
            key: 'Service Code',
            value: v1.serviceCode
          },
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

  converterDate(key: string, value: string) {
    if (key.includes('Date')) {
      return DateUtils.ConvertToDateFormat(value)
    }
    return value
  }
}
