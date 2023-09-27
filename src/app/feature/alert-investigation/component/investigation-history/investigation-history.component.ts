import {Component, Input} from '@angular/core';
import {AlertInvestigationHistoryDomain} from "../../domain/alert-investigation-history.domain";
import {DateUtils} from "../../../../shared/utils/date.utils";

@Component({
  selector: 'app-investigation-history',
  templateUrl: './investigation-history.component.html',
  styleUrls: ['./investigation-history.component.css']
})
export class InvestigationHistoryComponent {
  @Input() history: AlertInvestigationHistoryDomain[] = []

  protected readonly DateUtils = DateUtils;
}
