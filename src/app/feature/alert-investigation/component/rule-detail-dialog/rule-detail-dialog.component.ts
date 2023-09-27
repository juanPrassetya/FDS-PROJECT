import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TreeNode} from "primeng/api";

@Component({
  selector: 'app-rule-detail-dialog',
  templateUrl: './rule-detail-dialog.component.html',
  styleUrls: ['./rule-detail-dialog.component.css']
})
export class RuleDetailDialogComponent {
  @Input() ruleInfo: TreeNode[] = []
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  onDialogVisible() {
    setTimeout(() => {
      this.isLoading.emit(false)
    }, 200)
  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
