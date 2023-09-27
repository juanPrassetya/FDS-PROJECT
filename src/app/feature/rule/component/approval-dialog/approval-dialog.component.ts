import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RuleDomain} from "../../domain/rule.domain";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../../../user/domain/user.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {RuleService} from "../../services/rule.service";
import {RuleActivation, RuleApprove, RuleDeactivation, RuleReject} from "../../state/rule.actions";

@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.css']
})
export class ApprovalDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() itemSelected!: RuleDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();

  userData!: UserDomain
  form!: FormGroup;
  dummyStatus = [
    {name: 'Approve', code: true},
    {name: 'Reject', code: false},
  ]

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private ruleService: RuleService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      status: ['', Validators.required],
      comment: ['', Validators.required]
    })

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(RuleApprove, RuleReject),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(RuleApprove, RuleReject),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.form.reset()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {

  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(value: any) {
    if(this.itemSelected != undefined && this.userData != undefined){
      this.isLoading.emit(true)

      value.initiator = this.userData.username
      value.ruleId = this.itemSelected.ruleId

      if (value.status.code == true) {
        this.ruleService.onApproveRule(value.ruleId, value.initiator, value.comment)
      } else {
        this.ruleService.onRejectRule(value.ruleId, value.initiator, value.comment)
      }
    }
  }

  isValueNotValid() {
    const stat = this.getStatusField()?.hasError('required') || this.getCommentField()?.hasError('required')
    if (stat != undefined)
      return stat
    return true;
  }

  getStatusField() {
    return this.form.get('status')
  }

  getCommentField() {
    return this.form.get('comment')
  }
}

