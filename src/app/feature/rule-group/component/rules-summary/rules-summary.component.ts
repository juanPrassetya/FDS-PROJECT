import {Component, Input} from '@angular/core';
import {RuleDomain} from "../../../rule/domain/rule.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";

@Component({
  selector: 'app-rules-summary',
  templateUrl: './rules-summary.component.html',
  styleUrls: ['./rules-summary.component.css']
})
export class RulesSummaryComponent {
  @Input() rules: Array<RuleDomain> = []
  @Input() selectedItem: RuleDomain | undefined

  protected readonly DateUtils = DateUtils;
  convertedSelectedItem: Map<string, object> = new Map<string, object>()

  visibleRuleDetailDialog: boolean = false

  onRowClicked() {

  }

  onRowUnClicked() {

  }

  onDetailClicked(item: any) {
    this.selectedItem = item

    if (this.selectedItem != undefined) {
      this.visibleRuleDetailDialog = true;
      this.convertedSelectedItem = new Map<string, object>(Object.entries(item))
    }
  }

  onCloseTransDetailDialog(stat: boolean) {
    this.visibleRuleDetailDialog = stat
  }
}
