import {Component, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../user/domain/user.domain";
import {RecipientGroupState} from "../recipient-group/state/recipient-group.state";
import {ConfirmService} from "../../shared/services/confirm.service";
import {AuthService} from "../../shared/services/auth.service";
import {StringUtils} from "../../shared/utils/string.utils";
import {UserAuditDomain} from "./domain/user-audit.domain";
import {UserAuditState} from "./state/user-audit.state";
import {UserAuditService} from "./service/user-audit.service";
import {UserAuditGet, UserAuditGetQuery} from "./state/user-audit.actions";
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateUtils } from 'src/app/shared/utils/date.utils';
import { UserGet } from '../user/state/user.actions';
import { ForkJoinHelper } from 'src/app/shared/utils/rxjs.utils';
import { UserState } from '../user/state/user.state';

@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.css']
})
export class UserAuditComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>
  @Select(UserAuditState.data) audits$!: Observable<UserAuditDomain[]>
  @Select(UserState.data) users$!: Observable<UserDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  protected readonly DateUtils = DateUtils

  authorities: string[] = [];
  formGroup!: FormGroup

  selectedItem: UserAuditDomain | undefined

  items: Array<UserAuditDomain> = []
  itemUsers: Array<UserDomain> = []

  visibleUserAuditDetail: boolean = false
  visibleSearchDialog: boolean = false;

  isLoading: boolean = true;

  searchFilterFields = new Map<number, any[]>(
    [
      [0, [{name: 'Method', type: 2}, {name: 'URL', type: 1, field: 'url'}, {name: 'Host Address', type: 1, field: 'hostAddress'}]],
      [1, [{name: 'Remote Address', type: 1, field: 'remoteAddress'}, {name: 'User', type: 3}, {}]],
    ]
  );

  method = [
    {name: 'POST'},
    {name: 'DELETE'}
  ]

  constructor(
    private store$: Store,
    private action$: Actions,
    private userAuditService: UserAuditService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      status: [''],
      method: [''],
      url: [''],
      hostAddress: [''],
      remoteAddress: [''],
      user: ['']
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
          this.userAuditService.onFetchUserAudit()
        }
      } else this.isLoading = false
    })

    this.audits$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.items = data;
    })

    this.users$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.itemUsers = data;
    })

    this.action$.pipe(
      ofActionCompleted(UserAuditGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(UserAuditGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
      this.visibleSearchDialog = false;
    })

    this.action$
    .pipe(ofActionErrored(UserAuditGetQuery), takeUntil(this.destroyer$))
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
    this.userAuditService.onFetchUserAudit();
    this.visibleSearchDialog = false;
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const dateFromField = this.getDateFromField();
    const dateToField = this.getDateToField();
    if (data.dateFrom != '') {
      data.dateFrom = DateUtils.ConvertToTimestampFormatV3(data.dateFrom);
    }
    if (data.dateTo != '') {
      data.dateTo = DateUtils.ConvertToTimestampFormatV3(data.dateTo);
    }

    data.dateFrom = dateFromField?.value !== null ? data.dateFrom : '';
    data.dateTo = dateToField?.value !== null ? data.dateTo : '';

    if(data.method) {
      data.method = data.method.name;
    }

    if(data.user) {
      data.user = data.user.id
    }


    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.userAuditService.onFetchUserAuditQuery(data);
          return
        }
      }
    }

    this.userAuditService.onFetchUserAudit();
    
  }

  onListClicked() {

  }

  onListUnClicked() {
    this.selectedItem = undefined
  }

  onDetailClicked(item: any) {
    this.selectedItem = item
    this.visibleUserAuditDetail = true
  }

  onCloseDetail(stat: boolean) {
    this.visibleUserAuditDetail = stat
  }

  showAddtSearchFilter() {
    this.isLoading = true;
    this.userAuditService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(new UserGet())
        ],
        this.destroyer$,
        () => {
          this.visibleSearchDialog = !this.visibleSearchDialog;
          this.isLoading = false;
        }
      )
    })
  }

  getDateFromField() {
    return  this.formGroup.get('dateFrom')
  }

  getDateToField() {
    return this.formGroup.get('dateTo')
  }
}
