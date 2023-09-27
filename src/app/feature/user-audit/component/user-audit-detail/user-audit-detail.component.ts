import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NotifTemplateDomain} from "../../../notification-template/domain/notif-template.domain";
import {UserAuditDomain} from "../../domain/user-audit.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";

@Component({
  selector: 'app-user-audit-detail',
  templateUrl: './user-audit-detail.component.html',
  styleUrls: ['./user-audit-detail.component.css']
})
export class UserAuditDetailComponent {
  @Input() selectedItem: UserAuditDomain | undefined
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  protected readonly StringUtils = StringUtils;

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
