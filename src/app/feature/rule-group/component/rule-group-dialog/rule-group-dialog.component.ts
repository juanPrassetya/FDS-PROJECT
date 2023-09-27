import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {forkJoin, Observable, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RuleGroupDomain} from "../../domain/rule-group.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {UserGroupState} from "../../../user-group/state/user-group.state";
import {UserGroupDomain} from "../../../user-group/domain/user-group.domain";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {RuleGroupService} from "../../service/rule-group.service";
import {RuleGroupAdd, RuleGroupUpdate} from "../../state/rule-group.actions";
import {UserGroupGet} from "../../../user-group/state/user-group.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";

@Component({
  selector: 'app-rule-group-dialog',
  templateUrl: './rule-group-dialog.component.html',
  styleUrls: ['./rule-group-dialog.component.css']
})
export class RuleGroupDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected!: RuleGroupDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(UserGroupState.userGroups) userGroups$!: Observable<UserGroupDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;
  userGroups: Array<UserGroupDomain> = [];

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private ruleGroupService: RuleGroupService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      groupName: ['', Validators.required],
      isActive: ['', Validators.required],
      priority: ['', Validators.required],
      threshouldBlack: ['', Validators.required],
      threshouldGrey: [''],
      isForcedReaction: ['', Validators.required],
      userGroup: [{value: '', disabled: true}, Validators.required]
    })

    this.userGroups$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userGroups = data
    })

    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(RuleGroupAdd, RuleGroupUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(RuleGroupAdd, RuleGroupUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.form.reset()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    this.ruleGroupService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new UserGroupGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.getGroupNameField()?.setValue(this.itemSelected?.groupName)
              this.getStatusField()?.setValue(StringUtils.dummyStatus.find(v1 => v1.code == this.itemSelected?.isActive))
              this.getThreshouldBlackField()?.setValue(this.itemSelected?.threshouldBlack)
              this.getThreshouldGreyField()?.setValue(this.itemSelected?.threshouldGrey)
              this.getPriorityField()?.setValue(StringUtils.dummyPriority.find(v1 => v1.code == this.itemSelected?.priority))
              this.getIsForcedReactionField()?.setValue(StringUtils.dummyOption.find(v1 => v1.code == this.itemSelected?.isForcedReaction))
              this.getUserGroupField()?.setValue(this.itemSelected?.userGroup)

            } else {
              this.getUserGroupField()?.setValue(this.userData.userGroup)
            }

            this.isLoading.emit(false)
          }
        )
      }
    )
  }

  onSave(data: any) {
    this.isLoading.emit(true)
    data.id = this.itemSelected?.id
    data.isActive = data.isActive.code
    data.priority = data.priority.code
    data.isForcedReaction = data.isForcedReaction.code

    if (this.dialogMode == 'EDIT') {
      this.ruleGroupService.onUpdateRuleGroup(data)
    } else {
      this.ruleGroupService.onAddRuleGroup(data)
    }
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getGroupNameField()?.hasError('required') || this.getStatusField()?.hasError('required') ||
      this.getThreshouldBlackField()?.hasError('required') || this.getThreshouldGreyField()?.hasError('required') ||
      this.getIsForcedReactionField()?.hasError('required') || this.getUserGroupField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getGroupNameField() {
    return this.form.get('groupName')
  }

  getStatusField() {
    return this.form.get('isActive')
  }

  getThreshouldBlackField() {
    return this.form.get('threshouldBlack')
  }

  getThreshouldGreyField() {
    return this.form.get('threshouldGrey')
  }

  getPriorityField() {
    return this.form.get('priority')
  }

  getIsForcedReactionField() {
    return this.form.get('isForcedReaction')
  }

  getUserGroupField() {
    return this.form.get('userGroup')
  }
}
