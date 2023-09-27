import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RuleGroupDomain} from "../../domain/rule-group.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";

@Component({
  selector: 'app-rule-group-details',
  templateUrl: './rule-group-details.component.html',
  styleUrls: ['./rule-group-details.component.css']
})
export class RuleGroupDetailsComponent {
  @Input() selectedItem: RuleGroupDomain | undefined
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  protected readonly DateUtils = DateUtils;

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }

  isAvailable(value: any) {
    return value != '' && value != undefined
  }

  getStatus(stat: boolean | undefined) {
    if (stat)
      return 'Active'
    else
      return 'Not Active'
  }
}
