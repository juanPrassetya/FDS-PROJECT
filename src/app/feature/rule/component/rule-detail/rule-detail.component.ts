import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RuleDomain} from "../../domain/rule.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {RuleHistoryDomain} from "../../domain/rule-history.domain";

@Component({
  selector: 'app-rule-detail',
  templateUrl: './rule-detail.component.html',
  styleUrls: ['./rule-detail.component.css']
})
export class RuleDetailComponent {
  @Input() selectedItem: RuleDomain | undefined
  @Input() isOpen: boolean = false
  @Input() ruleHistory: RuleHistoryDomain[] = []
  @Output() closeSelf = new EventEmitter<boolean>()

  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }

  isContainHistory() {
    return this.ruleHistory.length > 0
  }

  charReplacement(value: string | undefined) {
    if (value != undefined) {
      return value.replace('_', ' ')
    }
    return value
  }
}
