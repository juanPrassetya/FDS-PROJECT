import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BlackListDomain} from "../../domain/black-list.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {StringUtils} from "../../../../shared/utils/string.utils";

@Component({
  selector: 'app-black-list-detail',
  templateUrl: './black-list-detail.component.html',
  styleUrls: ['./black-list-detail.component.css']
})
export class BlackListDetailComponent {
  @Input() selectedItem: BlackListDomain | undefined
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
