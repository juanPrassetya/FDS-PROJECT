import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {Subject, takeUntil} from "rxjs";
import {FraudReactionsDomain} from "../../../fraud-reactions/domain/fraud-reactions.domain";
import {FraudReactionsService} from "../../../fraud-reactions/service/fraud-reactions.service";
import {ConfirmService} from "../../../../shared/services/confirm.service";
import {
  FraudReactionsAdd,
  FraudReactionsDelete,
  FraudReactionsUpdate
} from "../../../fraud-reactions/state/fraud-reactions.actions";
import {RuleGroupDomain} from "../../domain/rule-group.domain";
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {AuthService} from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-reaction-summary',
  templateUrl: './reaction-summary.component.html',
  styleUrls: ['./reaction-summary.component.css']
})
export class ReactionSummaryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() reactions: Array<FraudReactionsDomain> = []
  @Input() groupSelected: RuleGroupDomain | undefined
  @Output() isLoading = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];

  selectedFraudReactionsItem: FraudReactionsDomain | undefined

  visibleFraudReactionsDetailDialog: boolean = false
  visibleReactionDialog: boolean = false

  dialogMode: string = 'ADD'

  constructor(
    private store$: Store,
    private action$: Actions,
    private fraudReactionsService: FraudReactionsService,
    private confirmService: ConfirmService,
    private authService: AuthService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedFraudReactionsItem = undefined
  }

  ngOnInit() {
    this.authorities = this.authService.getAuthorities();
    this.action$.pipe(
      ofActionSuccessful(FraudReactionsAdd, FraudReactionsUpdate, FraudReactionsDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading.emit(true)
      this.selectedFraudReactionsItem = undefined
    })

    // this.action$.pipe(
    //   ofActionCompleted(FraudReactionsGet, FraudReactionsAdd, FraudReactionsUpdate, FraudReactionsDelete),
    //   takeUntil(this.destroyer$)
    // ).subscribe(() => {
    //   this.isLoading.emit(false)
    // })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLoading(stat: boolean) {
    this.isLoading.emit(stat)
  }

  onReactClicked() {

  }

  onReactUnClicked() {
    this.selectedFraudReactionsItem = undefined
  }

  onClickedAddReactDialog() {
    this.dialogMode = 'ADD'
    this.visibleReactionDialog = true
  }

  onCloseReactDialog(stat: boolean) {
    this.visibleReactionDialog = stat
  }

  onClickedEditReactDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading.emit(true)
    this.visibleReactionDialog = true
  }

  onClickedDeleteReact() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading.emit(true)
      this.fraudReactionsService.onDeleteFraudReactions(Number(this.selectedFraudReactionsItem?.id))
    })
  }

  onDetailClicked(item: any) {
    this.selectedFraudReactionsItem = item
    this.visibleFraudReactionsDetailDialog = true
  }

  onCloseDetail(stat: boolean) {
    this.visibleFraudReactionsDetailDialog = stat
  }

  actionValueMapping(item: any) {
    if (item.action == 'EMAIL_NOTIFICATION') {
      return JSON.parse(item.actionValue).recipientType
    }

    return item.actionValue
  }

  charReplacement(value: string) {
    if (value != undefined) {
      return value.replace('_', ' ')
    }
    return value
  }
}
