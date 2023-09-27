import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {NotifTypeState} from "../../../notification-type/state/notif-type.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {NotifTypeDomain} from "../../../notification-type/domain/notif-type.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {RecipientSetupDomain} from "../../domain/recipient-setup.domain";
import {RecipientSetupService} from "../../service/recipient-setup.service";
import {RecipientSetupAdd, RecipientSetupUpdate} from "../../state/recipient-setup.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {NotificationTypeGet} from "../../../notification-type/state/notif-type.actions";

@Component({
  selector: 'app-recipient-setup-dialog',
  templateUrl: './recipient-setup-dialog.component.html',
  styleUrls: ['./recipient-setup-dialog.component.css']
})
export class RecipientSetupDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: RecipientSetupDomain | undefined
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
    private recipientSetupService: RecipientSetupService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      notificationType: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactValue: ['', Validators.required],
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
        ofActionSuccessful(RecipientSetupAdd, RecipientSetupUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(RecipientSetupAdd, RecipientSetupUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    this.recipientSetupService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new NotificationTypeGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.currentId = this.itemSelected != undefined ? Number(this.itemSelected.recipientId) : 0

              this.getFirstnameField()?.setValue(this.itemSelected?.firstName)
              this.getLastnameField()?.setValue(this.itemSelected?.lastName)
              this.getContactField()?.setValue(this.itemSelected?.contactValue)
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
      this.recipientSetupService.onUpdateRecipientSetup(this.currentId, data)
    } else this.recipientSetupService.onAddRecipientSetup(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getNotificationTypeField()?.getRawValue() == '' || this.getFirstnameField()?.hasError('required') ||
      this.getLastnameField()?.hasError('required') || this.getContactField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getNotificationTypeField() {
    return this.form.get('notificationType')
  }

  getFirstnameField() {
    return this.form.get('firstName')
  }

  getLastnameField() {
    return this.form.get('lastName')
  }

  getContactField() {
    return this.form.get('contactValue')
  }
}
