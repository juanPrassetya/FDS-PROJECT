import {Component, Input, OnInit} from '@angular/core';
import {AlertInvestigationDomain} from "../../domain/alert-investigation.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {AuthService} from "../../../../shared/services/auth.service";
import {AlertInvestigationDataDomain} from "../../domain/alert-investigation-data.domain";

@Component({
  selector: 'app-case-management',
  templateUrl: './case-management.component.html',
  styleUrls: ['./case-management.component.css']
})
export class CaseManagementComponent implements OnInit {
  @Input() itemSelected: AlertInvestigationDataDomain | undefined

  protected readonly StringUtils = StringUtils;

  visibleClassifyDialog: boolean = false
  visibleActionDialog: boolean = false

  isLoading: boolean = false
  authorities: string[] = []

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authorities = this.authService.getAuthorities()
  }

  onClickedClassify() {
    this.visibleClassifyDialog = true
  }

  onCloseClassify(stat: boolean) {
    this.visibleClassifyDialog = stat
  }

  onClickedAction() {
    this.visibleActionDialog = true
  }

  onCloseAction(stat: boolean) {
    this.visibleActionDialog = stat
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

}
