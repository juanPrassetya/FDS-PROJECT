import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Actions, Select, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { RuleDomain } from '../../domain/rule.domain';
import { RuleService } from '../../services/rule.service';
import { RuleExport } from '../../state/rule.actions';

@Component({
  selector: 'app-export-rule-dialog',
  templateUrl: './export-rule-dialog.component.html',
  styleUrls: ['./export-rule-dialog.component.css'],
})
export class ExportRuleDialogComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Input() items: Array<RuleDomain> = [];

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;
  protected readonly StringUtils = StringUtils;
  listIds: number[] = [];
  selectedListIds!: any;

  constructor(private ruleService: RuleService, private action$: Actions) {}

  ngOnInit(): void {
    this.action$
      .pipe(ofActionCompleted(RuleExport), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading.emit(false);
        this.onClose();
      });
  }

  onDialogVisible() {}

  onClose() {
    this.closeSelf.emit(false);
  }

  selectAll(data: any) {
    this.listIds = this.selectedListIds.map((item: { ruleId: any; }) => item.ruleId)
  }

  onRowSelect(data: any) {
    this.listIds.push(Number(data.data.ruleId));

    console.log(this.listIds)
  }

  onRowUnselect(data: any) {
    const indexToRemove = this.listIds.indexOf(Number(data.data.ruleId));
    if (indexToRemove !== -1) {
      this.listIds.splice(indexToRemove, 1);
    }
  }

  charReplacement(value: string) {
    if (value != undefined) {
      return value.replace('_', ' ');
    }
    return value;
  }
  onSave() {
    this.isLoading.emit(true);
    this.ruleService.onExportRule(this.listIds);
  }
}
