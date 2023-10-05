import { Component, OnDestroy, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { TreeNode } from 'primeng/api';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { TransactionState } from './state/transaction.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from './service/transaction.service';
import {
  TransactionGet,
  TransactionGetAddtData,
  TransactionGetByQuery,
  TransactionGetTriggeredRule,
} from './state/transaction.actions';
import { AuthState } from '../../shared/auth/state/auth.state';
import { TransactionDomain } from './domain/transaction.domain';
import { UserDomain } from '../user/domain/user.domain';
import { TriggeredRuleDomain } from './domain/triggered-rule.domain';
import { DateUtils } from '../../shared/utils/date.utils';
import { StringUtils } from '../../shared/utils/string.utils';
import { AuthService } from '../../shared/services/auth.service';
import { RuleDomain } from '../rule/domain/rule.domain';
import { TransactionAddtDomain } from './domain/transaction-addt.domain';
import { IntResponseCodeDomain } from '../response-code/domain/int-response-code.domain';
import { ExtIntJSONService } from '../ext-int-json/service/ext-int-json.service';
import { ResponseCodeService } from '../response-code/service/response-code.service';
import { getIntRespCode } from '../ext-int-iso8583/state/ext-int-iso8583.actions';
import { ExtIntISO8583State } from '../ext-int-iso8583/state/ext-int-iso8583.state';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(TransactionState.transactions) transactions$!: Observable<
    Map<string, object>[]
  >;
  @Select(TransactionState.triggeredRule) triggeredRule$!: Observable<
    TriggeredRuleDomain[]
  >;
  @Select(ExtIntISO8583State.intResponseCode) intRespCodes$!: Observable<
    IntResponseCodeDomain[]
  >;
  @Select(TransactionState.addtData) addtData$!: Observable<
    TransactionAddtDomain[]
  >;

  private destroyer$ = new Subject();
  private intervalId: any;
  protected readonly StringUtils = StringUtils;
  protected readonly DateUtils = DateUtils;
  transactionQuery!: any[];
  formGroup!: FormGroup;
  intRespCodes: Array<IntResponseCodeDomain> = [];

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        { name: 'Card Number', type: 1, field: 'hpan' },
        { name: 'PID', type: 1, field: 'pid' },
        { name: 'Reference Number', type: 1, field: 'refNum' },
      ],
    ],
    [
      1,
      [
        { name: 'Fraud Flag', type: 2, field: 'fraudFlags' },
        { name: 'Response Code', type: 4, field: 'respCode' },
        { name: 'Transaction Type', type: 1, field: 'transType' },
      ],
    ],
    [
      2,
      [
        { name: 'Amount', type: 1, field: 'amount' },
        { name: 'Currency', type: 1, field: 'currency' },
        { name: 'Merchant Type', type: 1, field: 'merchantType' },
      ],
    ],
    [
      3,
      [
        { name: 'Terminal Id', type: 1, field: 'terminalId' },
        {
          name: 'Issuer Institution Id',
          type: 1,
          field: 'issInstitCode',
        },
        { name: 'Destination Institution Id', type: 1, field: 'desInstitCode' },
      ],
    ],
    [
      4,
      [
        { name: 'Acquire Institution Id', type: 1, field: 'acqInstitCode' },
        { name: 'Source Account', type: 1, field: 'acct1' },
        {
          name: 'Destination Account',
          type: 1,
          field: 'acct2',
        },
      ],
    ],
    [
      5,
      [
        { name: 'Ext Response Code', type: 1, field: 'extRespCode' },
        { name: 'Prc Code', type: 1, field: 'prcCode' },
        { name: 'Is Alerted', type: 3, field: 'isAlerted' },
      ],
    ],
    [
      6,
      [
        { name: 'Fee Amount', type: 1, field: 'feeAmount' },
        { name: 'Pos Data Code', type: 1, field: 'posDataCode' },
        { name: 'Terminal Address', type: 1, field: 'terminalAddress' },
      ],
    ],
    [7, [{ name: 'STAN', type: 1, field: 'stan' }, {}, {}]],
  ]);
  fraudFlags = [
    { name: 'Not Fraud', code: '0' },
    { name: 'Suspicious', code: '1' },
    { name: 'Fraud', code: '2' },
  ];
  isAlerted = [
    { name: 'Yes', code: true },
    { name: 'No', code: false },
  ];

  columns = [
    {header: 'Name'},
    {header: 'MTI'},
    {header: 'HPAN'},
    {header: 'Processing'},
    {header: 'POS Entry'},
    {header: 'Terminal'},
    {header: 'Institution'},
    {header: 'Last Modify'},
    {header: 'Status'},
    {header: ''}

  ]

  clearHpan: string = '';
  exportColumns: any[] | undefined;

  authorities: string[] = [];
  isChecked: boolean = false;

  selectedItem!: TransactionDomain;
  itemSelected: Map<string, object> = new Map<string, object>();
  items: Array<Map<string, object>> = [];
  triggeredRule: TreeNode[] = [];
  addtData: TransactionAddtDomain[] = [];

  visibleHPANDialog: boolean = false;
  visibleSearchDialog: boolean = false;
  visibleTransactionDialog: boolean = false;
  visibleActionDialog: boolean = false;
  visibleWhiteListDialog: boolean = false;
  visibleBlackListDialog: boolean = false;
  visibleFraudListDialog: boolean = false;
  visibleFraudFlagDialog: boolean = false;

  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private store$: Store,
    private action$: Actions,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      utrnno: [''],
      pid: [''],
      acct1: [''],
      acct2: [''],
      acqInstitCode: [''],
      issInstitCode: [''],
      desInstitCode: [''],
      amount: [''],
      feeAmount: [''],
      currency: [''],
      hpan: [''],
      transType: [''],
      posDataCode: [''],
      prcCode: [''],
      refNum: [''],
      extRespCode: [''],
      stan: [''],
      merchantType: [''],
      terminalId: [''],
      terminalAddress: [''],
      fraudFlags: [''],
      respCode: [''],
      isAlerted: [''],
      dateFrom: [''],
      dateTo: [''],
    });
    this.authorities = this.authService.getAuthorities();
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (
          this.store$.selectSnapshot(TransactionState.transactions).length > 0
        ) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.transactionService.onFetchAllTransaction();
        }
      } else this.isLoading = false;
    });

    this.transactions$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.intRespCodes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.intRespCodes = data;
    });

    this.addtData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.addtData = data;
    });

    this.triggeredRule$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data.length > 0) {
        try {
          const v1Container = new Map<bigint, TreeNode>();

          data.forEach((v1) => {
            let convertedRule: RuleDomain = JSON.parse(v1.detailObj);
            let existingGroup = v1Container.get(convertedRule.ruleGroup.id);

            if (existingGroup != undefined) {
              if (existingGroup.children) {
                const v2 = {
                  label:
                    'Rule ' +
                    convertedRule.ruleId +
                    ' ' +
                    convertedRule.ruleName,
                  children: [
                    {
                      label: 'Risk Value ' + convertedRule.riskValue,
                    },
                    {
                      label:
                        'Date From ' +
                        DateUtils.ConvertToDateFormat(convertedRule.dateFrom),
                    },
                    {
                      label:
                        'Date To ' +
                        DateUtils.ConvertToDateFormat(convertedRule.dateTo),
                    },
                    {
                      label: 'Formula',
                      children: [
                        {
                          label: '',
                        },
                      ],
                    },
                  ],
                };

                convertedRule.ruleBodies.forEach((v3) => {
                  if (v2.children[3].children) {
                    v2.children[3].children.pop();
                    v2.children[3].children.push({
                      label:
                        v3.conditionId +
                        ' ' +
                        v3.condition +
                        ' - ' +
                        v3.detailCondition,
                    });
                  }
                });

                existingGroup.children[3].children?.push(v2);
              }
            } else {
              const v2 = {
                label:
                  'Group ' +
                  convertedRule.ruleGroup.id +
                  ' ' +
                  convertedRule.ruleGroup.groupName,
                children: [
                  {
                    label: 'Priority ' + convertedRule.ruleGroup.priority,
                  },
                  {
                    label:
                      'Threshold Black ' +
                      convertedRule.ruleGroup.threshouldBlack,
                  },
                  {
                    label:
                      'Threshold Grey ' +
                      convertedRule.ruleGroup.threshouldGrey,
                  },
                  {
                    label: 'Rules',
                    children: [
                      {
                        label:
                          'Rule ' +
                          convertedRule.ruleId +
                          ' ' +
                          convertedRule.ruleName,
                        children: [
                          {
                            label: 'Risk Value ' + convertedRule.riskValue,
                          },
                          {
                            label:
                              'Date From ' +
                              DateUtils.ConvertToDateFormat(
                                convertedRule.dateFrom
                              ),
                          },
                          {
                            label:
                              'Date To ' +
                              DateUtils.ConvertToDateFormat(
                                convertedRule.dateTo
                              ),
                          },
                          {
                            label: 'Formula',
                            children: [
                              {
                                label: '',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              };

              convertedRule.ruleBodies.forEach((v3) => {
                if (v2.children[3].children) {
                  v2.children[3].children[0].children[3].children?.pop();
                  v2.children[3].children[0].children[3].children?.push({
                    label:
                      v3.conditionId +
                      ' ' +
                      v3.condition +
                      ' - ' +
                      v3.detailCondition,
                  });
                }
              });

              v1Container.set(convertedRule.ruleGroup.id, v2);
            }
          });

          v1Container.forEach((value, key) => {
            this.triggeredRule.push(value);
          });
        } catch (err) {
          console.log(err);
        }
      }
    });

    this.action$
      .pipe(
        ofActionSuccessful(TransactionGet, TransactionGetByQuery),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = false;
      });

    this.action$
      .pipe(ofActionErrored(TransactionGetByQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    // this.action$
    //   .pipe(
    //     ofActionCompleted(TransactionGetByQuery),
    //     takeUntil(this.destroyer$)
    //   )
    //   .subscribe(() => {
    //     this.isLoading = false;
    //     this.visibleSearchDialog = false;
    //   });
  }

  ngOnDestroy() {
    this.transactionService.onResetAllInformation((ctx) => {
      ctx.setState({
        ...ctx.getState(),
        triggeredRule: [],
      });
    });

    this.clearScheduler();

    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  getFraudSev(status: String): string {
    if (status == '2') {
      return 'flag-status-color fraud-color';
    }

    if (status == '0') {
      return 'flag-status-color not-fraud-color';
    }

    if (status == '1') {
      return 'flag-status-color suspicious-color';
    }

    return '';
  }

  getAlertSev(status: boolean): string {
    if (status) {
      return 'flag-status-color suspicious-color';
    }

    return 'flag-status-color not-fraud-color';
  }

  getFraudFlag(fraudFlags: any) {
    switch (fraudFlags) {
      case 0:
        return 'NOT FRAUD';

      case 1:
        return 'SUSPICIOUS';

      case 2:
        return 'FRAUD';

      default:
        return 'UNKNOWN';
    }
  }

  getAlertFlag(stat: boolean) {
    if (stat) {
      return 'Alerted';
    }

    return 'Not Alerted';
  }

  showHPAN(hpan: String) {
    this.clearHpan = hpan.replace(/\./g, '1');
    this.visibleHPANDialog = !this.visibleHPANDialog;
  }

  isValueNotValid() {
    const stat =
      this.getUtrnnoField()?.getRawValue() == '' ||
      this.getDateFromField()?.hasError('required') ||
      this.getDateToField()?.hasError('required') ||
      this.getHpanField()?.hasError('required') ||
      this.getPidField()?.hasError('required') ||
      this.getRefNumField()?.hasError('required') ||
      this.getFraudFlagField()?.hasError('required') ||
      this.getRespCodeField()?.hasError('required') ||
      this.getTransTypeField()?.hasError('required') ||
      this.getAmountField()?.hasError('required') ||
      this.getCurrencyField()?.hasError('required') ||
      this.getMerchantTypeField()?.hasError('required') ||
      this.getTerminalIdField()?.hasError('required') ||
      this.getIssuerIdField()?.hasError('required') ||
      this.getDestinationIdField()?.hasError('required') ||
      this.getAcquireIdField()?.hasError('required') ||
      this.getSourceAccField()?.hasError('required') ||
      this.getDestAccField()?.hasError('required') ||
      this.getExtRespCodeField()?.hasError('required') ||
      this.getPrcCodeField()?.hasError('required') ||
      this.getPrcCodeField()?.hasError('required') ||
      this.getIsAlertedField()?.hasError('required') ||
      this.getFeeAmountField()?.hasError('required') ||
      this.getPosDataCodeField()?.hasError('required') ||
      this.getTerminalAddress()?.hasError('required') ||
      this.getStanField()?.hasError('required');
    return stat != undefined ? stat : true;
  }

  showAddtSearchFilter() {
    this.isLoading = true;
    this.transactionService.onFetchAllInformation((ctx) => {
      forkJoin([ctx.dispatch(new getIntRespCode())]).subscribe(() => {
        this.isLoading = false;
        this.visibleSearchDialog = true;
      });
    });
  }

  onClose() {
    this.formGroup.reset();
    this.visibleSearchDialog = false;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.transactionService.onFetchAllTransaction();
    this.getDateFromField()?.setValue('');
    this.getDateToField()?.setValue('');
    this.visibleSearchDialog = false;
  }

  updateCheck(event: any) {
    if (event.checked.length > 0) {
      this.clearScheduler();

      this.intervalId = setInterval(() => {
        this.onSearchClicked(this.formGroup.getRawValue());
      }, 1000);
    } else {
      this.clearScheduler();
    }
  }

  clearScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

    if (data.fraudFlags) {
      data.fraudFlags = data.fraudFlags.code;
    }

    if (data.isAlerted) {
      data.isAlerted = data.isAlerted.code;
    }

    if (data.respCode) {
      data.respCode = data.respCode.code;
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
          this.transactionService.onFetchTransactionByQuery(data);
          return;
        }
      }
    }

    this.transactionService.onFetchAllTransaction();
  }

  onDetailClicked(item: any) {
    this.isLoading = true;
    this.selectedItem = item;
    this.itemSelected = new Map<string, object>(Object.entries(item));
    this.transactionService.onFetchAllInformation((ctx) => {
      forkJoin([
        ctx.dispatch(new TransactionGetTriggeredRule(item.utrnno)),
        ctx.dispatch(new TransactionGetAddtData(item.utrnno)),
      ]).subscribe(() => {
        this.isLoading = false;
        this.visibleTransactionDialog = true;
      });
    });
  }

  onCloseTransDialog(stat: boolean) {
    this.visibleTransactionDialog = stat;
    this.triggeredRule = [];
  }

  onActionClicked() {
    if (this.selectedItem != undefined) {
      this.visibleActionDialog = !this.visibleActionDialog;
      this.itemSelected = new Map<string, object>(
        Object.entries(this.selectedItem)
      );
    }
  }

  onClickedWhite() {
    this.visibleActionDialog = !this.visibleActionDialog;
    this.visibleWhiteListDialog = !this.visibleWhiteListDialog;
  }

  onCloseWhite(stat: boolean) {
    this.visibleWhiteListDialog = stat;
  }

  onClickedBlack() {
    this.visibleActionDialog = !this.visibleActionDialog;
    this.visibleBlackListDialog = !this.visibleBlackListDialog;
  }

  onCloseBlack(stat: boolean) {
    this.visibleBlackListDialog = stat;
  }

  onClickedFraud() {
    this.visibleActionDialog = !this.visibleActionDialog;
    this.visibleFraudListDialog = !this.visibleFraudListDialog;
  }

  onCloseFraud(stat: boolean) {
    this.visibleFraudListDialog = stat;
  }

  onClickedFraudFlag() {
    this.visibleActionDialog = !this.visibleActionDialog;
    this.visibleFraudFlagDialog = !this.visibleFraudFlagDialog;
  }

  onCloseFraudFlag(stat: boolean) {
    this.visibleFraudFlagDialog = stat;
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.items);
        doc.save('products.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.items);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  onRowClicked() {}

  onRowUnClicked() {}

  isTransDeclined(respCode: string) {
    if (respCode != '-1' && respCode != '201') {
      return 'resp-code-declined';
    } else return '';
  }

  isRuleTriggered(data: any): string {
    if (
      data.ruleTrigger > 0 &&
      (data.respCode == '-1' || data.respCode == '201')
    ) {
      return 'rule-trigger-color';
    } else if (
      (data.ruleTrigger > 0 || data.ruleTrigger < 0) &&
      (data.respCode != '-1' || data.respCode != '201')
    ) {
      return 'rule-trigger-decline-color';
    }
    return '';
  }

  getUtrnnoField() {
    return this.formGroup.get('utrnno');
  }

  getDateFromField() {
    return this.formGroup.get('dateFrom');
  }

  getDateToField() {
    return this.formGroup.get('dateTo');
  }

  getHpanField() {
    return this.formGroup.get('HPAN');
  }

  getPidField() {
    return this.formGroup.get('pid');
  }

  getRefNumField() {
    return this.formGroup.get('refNum');
  }

  getFraudFlagField() {
    return this.formGroup.get('fraudFlags');
  }

  getRespCodeField() {
    return this.formGroup.get('respCode');
  }

  getTransTypeField() {
    return this.formGroup.get('transType');
  }

  getAmountField() {
    return this.formGroup.get('amount');
  }

  getCurrencyField() {
    return this.formGroup.get('currency');
  }

  getMerchantTypeField() {
    return this.formGroup.get('merchantType');
  }

  getTerminalIdField() {
    return this.formGroup.get('terminalId');
  }

  getIssuerIdField() {
    return this.formGroup.get('issInstitCode');
  }

  getDestinationIdField() {
    return this.formGroup.get('desInstitCode');
  }

  getAcquireIdField() {
    return this.formGroup.get('acqInstitCode');
  }

  getSourceAccField() {
    return this.formGroup.get('acct1');
  }

  getDestAccField() {
    return this.formGroup.get('acct2');
  }

  getExtRespCodeField() {
    return this.formGroup.get('extRespCode');
  }

  getPrcCodeField() {
    return this.formGroup.get('prcCode');
  }

  getIsAlertedField() {
    return this.formGroup.get('isAlerted');
  }

  getFeeAmountField() {
    return this.formGroup.get('feeAmount');
  }

  getPosDataCodeField() {
    return this.formGroup.get('posDataCode');
  }

  getTerminalAddress() {
    return this.formGroup.get('terminalAddress');
  }

  getStanField() {
    return this.formGroup.get('stan');
  }
}
