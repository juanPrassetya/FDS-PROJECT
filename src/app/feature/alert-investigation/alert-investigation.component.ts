import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subject, takeUntil} from 'rxjs';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import {AlertInvestigationState} from './state/alert-investigation.state';
import {AlertInvestigationDomain} from './domain/alert-investigation.domain';
import {DateUtils} from '../../shared/utils/date.utils';
import {AlertInvestigationService} from './service/alert-investigation.service';
import {AuthState} from '../../shared/auth/state/auth.state';
import {UserDomain} from '../user/domain/user.domain';
import {
  AlertInvestigationActionForwardedTo,
  AlertInvestigationClassifyAlert,
  AlertInvestigationGet,
  AlertInvestigationGetDemografi,
  AlertInvestigationGetHistory,
  AlertInvestigationGetLockByUsername,
  AlertInvestigationGetQuery,
  AlertInvestigationGetTriggeredRule,
  AlertInvestigationLockCase,
  AlertInvestigationTakeAction,
  AlertInvestigationUnLockCase,
} from './state/alert-investigation.actions';
import {TransactionState} from '../transaction/state/transaction.state';
import {AlertInvestigationHistoryDomain} from './domain/alert-investigation-history.domain';
import {AlertInvestigationDataDomain} from './domain/alert-investigation-data.domain';
import {TransactionGetByHpan} from '../transaction/state/transaction.actions';
import {ForkJoinHelper} from '../../shared/utils/rxjs.utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserGet} from '../user/state/user.actions';
import {UserState} from '../user/state/user.state';
import {StringUtils} from "../../shared/utils/string.utils";
import {TransactionService} from "../transaction/service/transaction.service";

@Component({
  selector: 'app-alert-investigation',
  templateUrl: './alert-investigation.component.html',
  styleUrls: ['./alert-investigation.component.css'],
})
export class AlertInvestigationComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(UserState.data) users$!: Observable<Array<UserDomain>>;
  @Select(AlertInvestigationState.data) alertData$!: Observable<
    AlertInvestigationDataDomain[]
  >;
  @Select(AlertInvestigationState.dataById)
  alertDataByUsername$!: Observable<AlertInvestigationDataDomain>;
  @Select(AlertInvestigationState.dataHistory) alertHistory$!: Observable<
    AlertInvestigationHistoryDomain[]
  >;
  @Select(TransactionState.transactionsByHpan) transactions$!: Observable<
    Map<string, object>[]
  >;

  private destroyer$ = new Subject();
  protected readonly DateUtils = DateUtils;

  selectedAlertCase: AlertInvestigationDataDomain | undefined;

  alertItems: Array<AlertInvestigationDataDomain> = [];
  alertHistory: Array<AlertInvestigationHistoryDomain> = [];
  alertItem: AlertInvestigationDataDomain | undefined;
  userData!: UserDomain;
  users: UserDomain[] = [];
  transactions: Map<string, object>[] = [];

  visibleAlertCaseDetailDialog: boolean = false;
  visibleSearchDialog: boolean = false;

  isLoading: boolean = true;
  formGroup!: FormGroup;

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        {name: 'Date From', type: 3, field: 'dateFrom'},
        {name: 'Date To', type: 4, field: 'dateTo'},
        {name: 'Action Type', type: 2, field: 'actionType'},
      ],
    ],
    [
      1,
      [
        {name: 'Locked By', type: 5, field: 'lockedBy'},
        {name: 'Classification Type', type: 6, field: 'clasificationType'},
        {},
      ],
    ],
  ]);

  dummyActionType = [
    {name: 'Add Alert Comment', code: '91'},
    {name: 'Forward To', code: '92'},
    {name: 'Add Card to List', code: '93'},
    {name: 'Add Account to List', code: '94'},
    {name: 'Add Merchant to List', code: '95'},
    {name: 'Add Terminal to List', code: '96'},
    {name: 'Remove Card from List', code: '70'},
    {name: 'Remove Account from List', code: '71'},
    {name: 'Remove Merchant from List', code: '72'},
    {name: 'Remove Terminal from List', code: '73'},
    {name: 'Put Card in Whitelist', code: '82'},
    {name: 'Put Account in Whitelist', code: '83'},
    {name: 'Put Merchant in Whitelist', code: '84'},
    {name: 'Put Terminal in Whitelist', code: '85'},
    {name: 'Put Card in Blacklist', code: '86'},
    {name: 'Put Account in Blacklist', code: '87'},
    {name: 'Put Merchant in Blacklist', code: '88'},
    {name: 'Put Terminal in Blacklist', code: '89'},
  ];

  dummyClassificationType = [
    {name: 'Negative', code: '10'},
    {name: 'Suspicious', code: '20'},
    {name: 'Positive', code: '30'},
  ];

  constructor(
    private store$: Store,
    private action$: Actions,
    private fb: FormBuilder,
    private alertInvestigationService: AlertInvestigationService,
    private transactionService: TransactionService,
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      caseId: [''],
      utrnno: [''],
      hpan: [''],
      initiator: [''],
      actionType: [''],
      lockedBy: [''],
      clasificationType: [''],
    });
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
      this.users = [
        this.userData
      ]
      if (data != undefined) {
        if (
          this.store$.selectSnapshot(AlertInvestigationState.data).length > 0
        ) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.alertInvestigationService.onGetAlertInvestigation(
            this.userData.username
          );
        }
      } else this.isLoading = false;
    });

    this.alertData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.alertItems = data;
    });

    this.alertDataByUsername$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.alertItem = data;
        this.selectedAlertCase = data;
      });

    this.transactions$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.transactions = data;
    });

    this.alertHistory$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.alertHistory = data;
    });

    this.action$
      .pipe(
        ofActionErrored(AlertInvestigationLockCase),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.alertItem = undefined;
        this.selectedAlertCase = undefined;
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionSuccessful(AlertInvestigationLockCase),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        if (this.alertItem != undefined) {
          this.onSearchClicked(this.formGroup.getRawValue())

          // this.alertInvestigationService.onGetAlertInvestigation(
          //   this.userData.username
          // );
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful(AlertInvestigationUnLockCase),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.alertItem = undefined;
        this.transactions = [];
        this.alertHistory = [];
        if (this.userData != undefined) {
          this.onSearchClicked(this.formGroup.getRawValue())

          // this.alertInvestigationService.onGetAlertInvestigation(
          //   this.userData.username
          // );
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful(
          AlertInvestigationTakeAction,
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        if (this.userData != undefined) {
          setTimeout(() => {
            this.isLoading = true;
            this.onSearchClicked(this.formGroup.getRawValue());
          }, 300);
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful
        (
          AlertInvestigationActionForwardedTo,
          AlertInvestigationClassifyAlert
        ),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onAlertUnClicked();
    })


    this.action$
      .pipe(
        ofActionSuccessful(AlertInvestigationGet, AlertInvestigationGetQuery),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        if (this.userData != undefined) {
          this.visibleSearchDialog = false;
          this.alertInvestigationService.onGetLockCaseByUsername(
            this.userData.username
          );
        }
      });

    this.action$
      .pipe(ofActionErrored(AlertInvestigationGet, AlertInvestigationGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(AlertInvestigationGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(AlertInvestigationGetLockByUsername),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        if (this.alertItem != undefined) {
          if (

            this.alertItem.case_id != undefined &&
            this.alertItem.utrnno != undefined
          ) {
            // if (
            //   this.alertItem.HPAN != undefined &&
            //   this.alertItem.CASE_ID != undefined &&
            //   this.alertItem.UTRNNO != undefined &&
            //   this.alertItem.REF_NUM != undefined
            // ) {
            this.getAllInformation(this.alertItem);
          } else {
            this.isLoading = false;
          }
        } else this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.transactionService.onResetAllInformation(
      (ctx) => {
        ctx.setState({
          ...ctx.getState(),
          transactionsByHpan: [],
        })
      });

    this.alertInvestigationService.onGetAllInformation(
      (ctx) => {
        ctx.setState({
          ...ctx.getState(),
          dataDemografi: undefined,
          dataRule: [],
          dataHistory: []
        })
      }
    )

    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  isValueNotValid() {
    const stat =
      this.getUtrnnoField()?.getRawValue() == '' ||
      this.getCaseIdField()?.hasError('required') ||
      this.getHpanField()?.hasError('required') ||
      this.getDateFromField()?.hasError('required') ||
      this.getDateToField()?.hasError('required') ||
      this.getActionTypeField()?.hasError('required') ||
      this.getLockedByField()?.hasError('required') ||
      this.getClassificationType()?.hasError('required')
    return stat != undefined ? stat : true;
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.getDateFromField()?.setValue('')
    this.getDateToField()?.setValue('')
    this.alertInvestigationService.onGetAlertInvestigation(
      this.userData.username
    );
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const dateFromField = this.getDateFromField();
    const dateToField = this.getDateToField();
    if (data.lockedBy) {
      data.lockedBy = data.lockedBy.username;
    }

    if (data.clasificationType) {
      data.clasificationType = data.clasificationType.code;
    }

    if (data.dateFrom != '') {
      data.dateFrom = DateUtils.ConvertToTimestampFormatV3(data.dateFrom);
    }
    if (data.dateTo != '') {
      data.dateTo = DateUtils.ConvertToTimestampFormatV3(data.dateTo);
    }

    if (data.actionType) {
      data.actionType = data.actionType.code;
    }
    data.dateFrom = dateFromField?.value !== null ? data.dateFrom : '';
    data.dateTo = dateToField?.value !== null ? data.dateTo : '';

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (
          controlValue != null &&
          controlValue != undefined &&
          controlValue != ''
        ) {
          this.alertInvestigationService.onGetAlertInvestigationQuery(data);
          return;
        }
      }
    }

    this.alertInvestigationService.onGetAlertInvestigation(
      this.userData.username
    );
  }

  onAlertClicked() {
    this.isLoading = true;
    this.alertItem = this.selectedAlertCase;

    if (this.alertItem != null) {
      const alertData = new AlertInvestigationDomain();
      alertData.lockedBy = this.userData.username;
      alertData.caseId = this.alertItem.case_id;
      this.lockCase(alertData);
    }
  }

  onAlertUnClicked() {
    this.isLoading = true;

    if (this.alertItem != null) {
      const alertData = new AlertInvestigationDomain();
      alertData.lockedBy = this.userData.username;
      alertData.caseId = this.alertItem.case_id;
      this.unLockCase(alertData);
    }
  }

  onAlertCaseDetailClicked(item: any) {
    this.selectedAlertCase = item;
    this.visibleAlertCaseDetailDialog = true;
  }

  onAlertCaseCloseDetail(stat: boolean) {
    this.visibleAlertCaseDetailDialog = stat;
  }

  lockCase(data: any) {
    this.alertInvestigationService.onLockCaseAlertInvestigation(data);
  }

  unLockCase(data: any) {
    this.alertInvestigationService.onUnLockCaseAlertInvestigation(data);
  }

  showAddtSearchFilter() {
    this.visibleSearchDialog = !this.visibleSearchDialog;
  }

  disableSelectRow(item: any) {
    if (this.alertItem == undefined) {
      return false;
    }
    return item.case_id != this.alertItem.case_id;
    // return item.CASE_ID != this.alertItem.CASE_ID;
  }

  getAllInformation(data: AlertInvestigationDataDomain) {
    this.alertInvestigationService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(
            new TransactionGetByHpan({
              hpan: data.hpan,
              custId: data.cif_id,
              acct1: data.acct1,
              alertDate: data.sysdate,
            })
          ),
          ctx.dispatch(new AlertInvestigationGetHistory(Number(data.case_id))),
          ctx.dispatch(
            new AlertInvestigationGetTriggeredRule(data.utrnno.toString())
          ),
          ctx.dispatch(
            new AlertInvestigationGetDemografi(
              data.utrnno.toString(),
              data.ref_num
            )
          ),
          ctx.dispatch(new UserGet()),
        ],
        this.destroyer$,
        () => {
          this.isLoading = false;
        }
      );
    });
  }

  getSev(status: String): string {
    if (status == '30') {
      return 'flag-status-color fraud-color';
    }

    if (status == '10') {
      return 'flag-status-color not-fraud-color';
    }

    if (status == '20') {
      return 'flag-status-color suspicious-color';
    }

    return ''
  }

  getClassified(fraudFlags: any) {
    switch (fraudFlags) {
      case 10:
        return 'NOT FRAUD'

      case 20:
        return 'SUSPICIOUS'

      case 30:
        return 'FRAUD'

      default:
        return ''
    }
  }

  getActionDesc(action_type: any) {
    for (const value of this.dummyActionType) {
      if (value.code == action_type) {
        return value.name;
      }
    }

    return ''
  }

  getUtrnnoField() {
    return this.formGroup.get('utrnno');
  }

  getCaseIdField() {
    return this.formGroup.get('caseId');
  }

  getHpanField() {
    return this.formGroup.get('hpan');
  }

  getDateFromField() {
    return this.formGroup.get('dateFrom');
  }

  getDateToField() {
    return this.formGroup.get('dateTo');
  }

  getActionTypeField() {
    return this.formGroup.get('actionType');
  }

  getLockedByField() {
    return this.formGroup.get('lockedBy');
  }

  getClassificationType() {
    return this.formGroup.get('classificationType');
  }
}
