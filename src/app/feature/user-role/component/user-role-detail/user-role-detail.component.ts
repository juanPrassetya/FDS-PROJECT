import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TreeNode} from "primeng/api";
import {UserRoleDomain} from "../../domain/user-role.domain";

@Component({
  selector: 'app-user-role-detail',
  templateUrl: './user-role-detail.component.html',
  styleUrls: ['./user-role-detail.component.css']
})
export class UserRoleDetailComponent implements OnInit{
  @Input() selectedItem: UserRoleDomain | undefined
  @Input() ruleInfo: TreeNode[] = []
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  constructor(

  ) {
  }

  ngOnInit() {

  }

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }
}
