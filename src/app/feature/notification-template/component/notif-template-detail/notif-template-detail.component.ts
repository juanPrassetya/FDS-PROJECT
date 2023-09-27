import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NotifTemplateDomain} from "../../domain/notif-template.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";

@Component({
  selector: 'app-notif-template-detail',
  templateUrl: './notif-template-detail.component.html',
  styleUrls: ['./notif-template-detail.component.css']
})
export class NotifTemplateDetailComponent {
  @Input() selectedItem: NotifTemplateDomain | undefined
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  protected readonly StringUtils = StringUtils;

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
