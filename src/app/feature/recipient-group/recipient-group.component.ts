import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../user/domain/user.domain";
import {ConfirmService} from "../../shared/services/confirm.service";
import {AuthService} from "../../shared/services/auth.service";
import {RecipientGroupState} from "./state/recipient-group.state";
import {RecipientGroupDomain} from "./domain/recipient-group.domain";
import {StringUtils} from "../../shared/utils/string.utils";
import {RecipientGroupService} from "./service/recipient-group.service";
import {
  RecipientGroupAdd,
  RecipientGroupDelete,
  RecipientGroupGet,
  RecipientGroupGetQuery,
  RecipientGroupUpdate
} from "./state/recipient-group.actions";
import {RecipientSetupDomain} from "../recipient-setup/domain/recipient-setup.domain";
import { NotifTypeState } from '../notification-type/state/notif-type.state';
import { NotifTypeDomain } from '../notification-type/domain/notif-type.domain';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifTypeService } from '../notification-type/service/notif-type.service';

@Component({
  selector: 'app-recipient-group',
  templateUrl: './recipient-group.component.html',
  styleUrls: ['./recipient-group.component.css']
})
export class RecipientGroupComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(RecipientGroupState.data) groups$!: Observable<RecipientGroupDomain[]>
  @Select(NotifTypeState.data) notifTypes$!: Observable<NotifTypeDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup

  selectedItem: RecipientGroupDomain | undefined

  items: Array<RecipientGroupDomain> = []
  notifTypes: Array<NotifTypeDomain> = []
  childItems: Array<RecipientSetupDomain> = []

  visibleRecipientDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private recipientGroupService: RecipientGroupService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private notifTypeService: NotifTypeService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      groupName: [''],
      notificationType: ['']
    })
    this.authorities = this.authService.getAuthorities()

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(RecipientGroupState.data).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.recipientGroupService.onFetchRecipientGroup()
          this.notifTypeService.onGetNotificationType();
        }
      } else this.isLoading = false
    })

    this.groups$
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
      ofActionSuccessful(RecipientGroupAdd, RecipientGroupUpdate, RecipientGroupDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedItem = undefined
      this.recipientGroupService.onFetchRecipientGroup()
    })

    this.action$.pipe(
      ofActionErrored(RecipientGroupAdd, RecipientGroupUpdate, RecipientGroupDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(RecipientGroupGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(RecipientGroupGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
      .pipe(ofActionErrored(RecipientGroupGetQuery), takeUntil(this.destroyer$))
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
    this.recipientGroupService.onFetchRecipientGroup();
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
          this.recipientGroupService.onFetchRecipientGroupQuery(data);
          return
        }
      }
    }

    this.recipientGroupService.onFetchRecipientGroup();
    
  }

  onListClicked() {
    if (this.selectedItem != undefined)
      this.childItems = this.selectedItem.recipientSetups
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
      this.recipientGroupService.onDeleteRecipientGroup(Number(this.selectedItem?.groupId))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleRecipientDialog = stat
  }
}
