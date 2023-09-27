import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {UserGroupState} from "../../../user-group/state/user-group.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserGroupDomain} from "../../../user-group/domain/user-group.domain";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WhiteListAdd, WhiteListUpdate} from "../../state/white-list.actions";
import {WhiteListDomain} from "../../domain/white-list.domain";
import {WhiteListService} from "../../service/white-list.service";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {TransParamGet} from "../../../transaction-parameter/state/trans-param.actions";
import {UserGroupGet} from "../../../user-group/state/user-group.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";

@Component({
  selector: 'app-white-list-dialog',
  templateUrl: './white-list-dialog.component.html',
  styleUrls: ['./white-list-dialog.component.css']
})
export class WhiteListDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected!: WhiteListDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(UserGroupState.userGroups) userGroups$!: Observable<UserGroupDomain[]>
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;
  transParams: Array<TransParamDomain> = []
  userGroups: Array<UserGroupDomain> = [];

  currentId: number = 0

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private whiteListService: WhiteListService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      value: ['', Validators.required],
      entityType: ['', Validators.required],
      dateIn: ['', Validators.required],
      dateOut: ['', Validators.required],
      reason: [''],
      userGroup: [{value: '', disabled: true}, Validators.required]
    })

    this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.transParams = data
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getEntityTypeField()?.setValue(this.transParams.find(v1 => v1.attribute == this.itemSelected?.entityType))
      }
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
        ofActionSuccessful(WhiteListAdd, WhiteListUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(WhiteListAdd, WhiteListUpdate),
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

    this.whiteListService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [
            ctx.dispatch(new TransParamGet()),
            ctx.dispatch(new UserGroupGet()),
          ], this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.currentId = this.itemSelected != undefined ? Number(this.itemSelected.id) : 0

              this.getValueField()?.setValue(this.itemSelected?.value)
              this.getUserGroupField()?.setValue(this.itemSelected?.userGroup)
              this.getReasonField()?.setValue(this.itemSelected?.reason)

              if (this.itemSelected != undefined) {
                this.getDateInField()?.setValue(DateUtils.ConvertToDateFormat(this.itemSelected?.dateIn))
                this.getDateOutField()?.setValue(DateUtils.ConvertToDateFormat(this.itemSelected?.dateOut))
              }
            } else {
              this.getUserGroupField()?.setValue(this.userData.userGroup)
            }

            setTimeout(() => {
              this.isLoading.emit(false)
            }, 200)
          }
        )
      }
    )
  }

  onSave(data: any) {
    this.isLoading.emit(true)
    data.initiator = this.userData
    data.entityType = data.entityType.attribute
    data.dateIn = DateUtils.ConvertToTimestampFormat(data.dateIn)
    data.dateOut = DateUtils.ConvertToTimestampFormat(data.dateOut)

    if (this.dialogMode == 'EDIT') {
      this.whiteListService.onUpdateWhiteList(this.currentId, data)
    } else this.whiteListService.onAddWhiteList(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  isValueNotValid() {
    const stat = this.getValueField()?.getRawValue() == '' || this.getEntityTypeField()?.hasError('required') ||
      this.getDateInField()?.hasError('required') || this.getDateOutField()?.hasError('required') ||
      this.getUserGroupField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getValueField() {
    return this.form.get('value')
  }

  getEntityTypeField() {
    return this.form.get('entityType')
  }

  getDateInField() {
    return this.form.get('dateIn')
  }

  getDateOutField() {
    return this.form.get('dateOut')
  }

  getUserGroupField() {
    return this.form.get('userGroup')
  }

  getReasonField() {
    return this.form.get('reason')
  }
}
