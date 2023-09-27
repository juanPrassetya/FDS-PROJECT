import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RuleService} from "../../services/rule.service";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {RuleDomain} from "../../domain/rule.domain";
import {RuleActivation, RuleDeactivation} from "../../state/rule.actions";

@Component({
  selector: 'app-set-status-dialog',
  templateUrl: './set-status-dialog.component.html',
  styleUrls: ['./set-status-dialog.component.css']
})
export class SetStatusDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() itemSelected!: RuleDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();

  userData!: UserDomain
  form!: FormGroup;
  dummyStatus = StringUtils.dummyStatus

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
        ofActionSuccessful(RuleActivation, RuleDeactivation),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(RuleActivation, RuleDeactivation),
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
        this.ruleService.onActivationRule(value.ruleId, value.initiator, value.comment)
      } else {
        this.ruleService.onDeactivationRule(value.ruleId, value.initiator, value.comment)
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
