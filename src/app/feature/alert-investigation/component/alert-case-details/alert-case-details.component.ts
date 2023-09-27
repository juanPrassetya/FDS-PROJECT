import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DateUtils} from "../../../../shared/utils/date.utils";
import {AlertInvestigationDataDomain} from "../../domain/alert-investigation-data.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";

@Component({
  selector: 'app-alert-case-details',
  templateUrl: './alert-case-details.component.html',
  styleUrls: ['./alert-case-details.component.css']
})
export class AlertCaseDetailsComponent {
  @Input() selectedItem: AlertInvestigationDataDomain | undefined
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

  getClassified(fraudFlags: any) {
    switch (fraudFlags) {
      case 10:
        return 'NOT FRAUD'

      case 20:
        return 'SUSPICIOUS'

      case 30:
        return 'FRAUD'

      default:
        return ''
    }
  }

  getActionDesc(action_type: any) {
    for (const value of StringUtils.dummyActionType) {
      if (value.code == action_type) {
        return value.name;
      }
    }

    return ''
  }
}
