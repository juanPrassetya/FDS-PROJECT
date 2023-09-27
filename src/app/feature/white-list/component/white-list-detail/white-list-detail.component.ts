import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WhiteListDomain} from "../../domain/white-list.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {StringUtils} from "../../../../shared/utils/string.utils";

@Component({
  selector: 'app-white-list-detail',
  templateUrl: './white-list-detail.component.html',
  styleUrls: ['./white-list-detail.component.css']
})
export class WhiteListDetailComponent {
  @Input() selectedItem: WhiteListDomain | undefined
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
