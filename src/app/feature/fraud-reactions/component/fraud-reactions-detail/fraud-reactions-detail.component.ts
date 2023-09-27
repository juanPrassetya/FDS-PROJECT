import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FraudReactionsDomain} from "../../domain/fraud-reactions.domain";

@Component({
  selector: 'app-fraud-reactions-detail',
  templateUrl: './fraud-reactions-detail.component.html',
  styleUrls: ['./fraud-reactions-detail.component.css']
})
export class FraudReactionsDetailComponent {
  @Input() selectedItem: FraudReactionsDomain | undefined
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }

  isAvailable(value: any) {
    return value != '' && value != undefined
  }

  actionValueMapping(item: any) {
    if (item.action == 'EMAIL_NOTIFICATION') {
      return JSON.parse(item.actionValue).recipientType
    }

    return item.actionValue
  }

  charReplacement(value: string | undefined) {
    if (value != undefined) {
      return value.replace('_', ' ')
    }
    return value
  }
}
