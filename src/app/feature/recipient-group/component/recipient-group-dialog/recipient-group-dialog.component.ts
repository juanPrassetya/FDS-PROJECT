import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {NotifTypeState} from "../../../notification-type/state/notif-type.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {NotifTypeDomain} from "../../../notification-type/domain/notif-type.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {RecipientGroupDomain} from "../../domain/recipient-group.domain";
import {RecipientGroupAdd, RecipientGroupUpdate} from "../../state/recipient-group.actions";
import {RecipientGroupService} from "../../service/recipient-group.service";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {NotificationTypeGet} from "../../../notification-type/state/notif-type.actions";

@Component({
  selector: 'app-recipient-group-dialog',
  templateUrl: './recipient-group-dialog.component.html',
  styleUrls: ['./recipient-group-dialog.component.css']
})
export class RecipientGroupDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: RecipientGroupDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(NotifTypeState.data) notifTypes$!: Observable<NotifTypeDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  notifTypes: Array<NotifTypeDomain> = []

  currentId: number = 0

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private recipientGroupService: RecipientGroupService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      notificationType: ['', Validators.required],
      groupName: ['', Validators.required],
    })

    this.notifTypes$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.notifTypes = data
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getNotificationTypeField()?.setValue(this.notifTypes.find(v1 => v1.notificationType == this.itemSelected?.notificationType.notificationType))
      }
    })

    this.action$
      .pipe(
        ofActionSuccessful(RecipientGroupAdd, RecipientGroupUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(RecipientGroupAdd, RecipientGroupUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    this.recipientGroupService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new NotificationTypeGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.currentId = this.itemSelected != undefined ? Number(this.itemSelected.groupId) : 0

              this.getGroupNameField()?.setValue(this.itemSelected?.groupName)
            }

            this.isLoading.emit(false)
          }
        )
      }
    )
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.recipientGroupService.onUpdateRecipientGroup(this.currentId, data)
    } else this.recipientGroupService.onAddRecipientGroup(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getNotificationTypeField()?.getRawValue() == '' || this.getGroupNameField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getNotificationTypeField() {
    return this.form.get('notificationType')
  }

  getGroupNameField() {
    return this.form.get('groupName')
  }
}
