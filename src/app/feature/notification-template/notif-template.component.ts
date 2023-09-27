import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {NotifTemplateDomain} from "./domain/notif-template.domain";
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {ConfirmService} from "../../shared/services/confirm.service";
import {AuthService} from "../../shared/services/auth.service";
import {AuthState} from "../../shared/auth/state/auth.state";
import {UserDomain} from "../user/domain/user.domain";
import {NotifTemplateService} from "./service/notif-template.service";
import {NotifTemplateState} from "./state/notif-template.state";
import {
  NotifTemplateAdd,
  NotifTemplateDelete,
  NotifTemplateGet,
  NotifTemplateGetQuery,
  NotifTemplateUpdate
} from "./state/notif-template.actions";
import {StringUtils} from "../../shared/utils/string.utils";
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifTypeState } from '../notification-type/state/notif-type.state';
import { NotifTypeDomain } from '../notification-type/domain/notif-type.domain';
import { NotifTypeService } from '../notification-type/service/notif-type.service';

@Component({
  selector: 'app-notification-template',
  templateUrl: './notif-template.component.html',
  styleUrls: ['./notif-template.component.css']
})
export class NotifTemplateComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(NotifTemplateState.data) notifTemplate$!: Observable<NotifTemplateDomain[]>
  @Select(NotifTypeState.data) notifTypes$!: Observable<NotifTypeDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup

  selectedItem: NotifTemplateDomain | undefined
  notifTypes: Array<NotifTypeDomain> = []

  items: Array<NotifTemplateDomain> = []

  visibleNotifTemplateDialog: boolean = false
  visibleNotifTemplateDetailDialog: boolean = false

  dialogMode: string = 'ADD'
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private notifTemplateService: NotifTemplateService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder,
    private notifTypeService: NotifTypeService
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      subjectText: [''],
      notificationType: ['']
    })
    this.authorities = this.authService.getAuthorities()

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(NotifTemplateState.data).length > 0) {
          this.isLoading = false
        } else {
          this.isLoading = true
          this.notifTemplateService.onFetchNotifTemplate()
          this.notifTypeService.onGetNotificationType();

        }
      } else this.isLoading = false
    })

    this.notifTemplate$
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
      ofActionSuccessful(NotifTemplateAdd, NotifTemplateUpdate, NotifTemplateDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedItem = undefined
      this.notifTemplateService.onFetchNotifTemplate()
    })

    this.action$.pipe(
      ofActionErrored(NotifTemplateAdd, NotifTemplateUpdate, NotifTemplateDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(NotifTemplateGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(NotifTemplateGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
      .pipe(ofActionErrored(NotifTemplateGetQuery), takeUntil(this.destroyer$))
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
    this.notifTemplateService.onFetchNotifTemplate();
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
          this.notifTemplateService.onFetchNotifTemplateQuery(data);
          return
        }
      }
    }

    this.notifTemplateService.onFetchNotifTemplate();
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleNotifTemplateDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleNotifTemplateDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.notifTemplateService.onDeleteNotifTemplate(Number(this.selectedItem?.templateId))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleNotifTemplateDialog = stat
  }

  onDetailClicked(item: any) {
    this.selectedItem = item
    this.visibleNotifTemplateDetailDialog = true
  }

  onCloseDetail(stat: boolean) {
    this.visibleNotifTemplateDetailDialog = stat
  }
}
