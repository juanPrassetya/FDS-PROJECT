import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../user/domain/user.domain";
import {ConfirmService} from "../../shared/services/confirm.service";
import {AuthService} from "../../shared/services/auth.service";
import {StringUtils} from "../../shared/utils/string.utils";
import {RecipientSetupState} from "./state/recipient-setup.state";
import {RecipientSetupDomain} from "./domain/recipient-setup.domain";
import {RecipientSetupService} from "./service/recipient-setup.service";
import {
  RecipientSetupAdd,
  RecipientSetupDelete,
  RecipientSetupGet,
  RecipientSetupGetQuery,
  RecipientSetupUpdate
} from "./state/recipient-setup.actions";
import { NotifTypeState } from '../notification-type/state/notif-type.state';
import { NotifTypeDomain } from '../notification-type/domain/notif-type.domain';
import { NotifTypeService } from '../notification-type/service/notif-type.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-recipient-setup',
  templateUrl: './recipient-setup.component.html',
  styleUrls: ['./recipient-setup.component.css']
})
export class RecipientSetupComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(RecipientSetupState.data) recipients$!: Observable<RecipientSetupDomain[]>
  @Select(NotifTypeState.data) notifTypes$!: Observable<NotifTypeDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup

  selectedItem: RecipientSetupDomain | undefined

  items: Array<RecipientSetupDomain> = []
  notifTypes: Array<NotifTypeDomain> = []

  visibleRecipientDialog: boolean = false
  visibleRecipientDetailDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private recipientSetupService: RecipientSetupService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private notifTypeService: NotifTypeService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      firstName: [''],
      lastName: [''],
      contactValue: [''],
      notificationType: ['']
    })
    this.authorities = this.authService.getAuthorities()

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(RecipientSetupState.data).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.recipientSetupService.onFetchRecipientSetup();
          this.notifTypeService.onGetNotificationType();
        }
      } else this.isLoading = false
    })

    this.recipients$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.items = data;
    })

    this.notifTypes$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.notifTypes = data;
    })

    this.action$.pipe(
      ofActionSuccessful(RecipientSetupAdd, RecipientSetupUpdate, RecipientSetupDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedItem = undefined
      this.recipientSetupService.onFetchRecipientSetup()
    })

    this.action$.pipe(
      ofActionErrored(RecipientSetupAdd, RecipientSetupUpdate, RecipientSetupDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(RecipientSetupGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(RecipientSetupGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
      .pipe(ofActionErrored(RecipientSetupGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.recipientSetupService.onFetchRecipientSetup();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    if(data.notificationType) {
      data.notificationType = data.notificationType.id
    }

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.recipientSetupService.onFetchRecipientSetupQuery(data);
          return
        }
      }
    }

    this.recipientSetupService.onFetchRecipientSetup();
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleRecipientDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleRecipientDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.recipientSetupService.onDeleteRecipientSetup(Number(this.selectedItem?.recipientId))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleRecipientDialog = stat
  }

  onDetailClicked(item: any) {
    this.selectedItem = item
    this.visibleRecipientDetailDialog = true
  }

  onCloseDetail(stat: boolean) {
    this.visibleRecipientDetailDialog = stat
  }
}
