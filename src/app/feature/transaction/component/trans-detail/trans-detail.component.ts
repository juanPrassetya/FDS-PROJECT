import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TreeNode} from "primeng/api";
import {TransactionAddtDomain} from "../../domain/transaction-addt.domain";

@Component({
  selector: 'app-trans-detail',
  templateUrl: './trans-detail.component.html',
  styleUrls: ['./trans-detail.component.css']
})
export class TransDetailComponent implements OnInit, OnChanges {
  @Input() selectedItem: Map<string, object> = new Map<string, Object>()
  @Input() ruleInfo: TreeNode[] = []
  @Input() addtData: TransactionAddtDomain[] = []
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()

  informationLabelValues: any[] = []

  listOfLabel = [
    // {key:'accountNo', label: 'Customer Account'},
    {key:'custName', label: 'Customer Name'},
    {key:'cpan', label: 'Customer Pan'},
    {key:'sysdate', label: 'Transaction Date'},
    {key: 'transType', label: 'Transaction Type'},
    {key: 'transTypeDesc', label: 'Transaction Type Desc'},
    {key:'prcCode', label: 'Processing Code'},
    {key:'pid', label: 'PID'},
    {key:'utrnno', label: 'UTRNNO'},
    {key:'stan', label: 'STAN'},
    {key:'refNum', label: 'Reference Number'},
    {key:'extRespCode', label: 'Ext Response Code'},
    {key:'respCode', label: 'Response Code'},
    {key:'respCodeDesc', label: 'Response Code Desc'},
    {key:'fraudFlags', label: 'Fraud Flag'},
    {key:'hpan', label: 'Card Number'},
    {key:'cifId', label: 'Customer Id'},
    {key:'amount', label: 'Amount'},
    {key:'cvtAmount', label: 'Cvt Amount'},
    {key:'feeAmount', label: 'Fee Amount'},
    {key:'acctBalance', label: 'Account Balance'},
    {key:'currency', label: 'Currency'},
    {key:'posDataCode', label: 'POS Data Code'},
    {key:'terminalId', label: 'Terminal Id'},
    {key:'terminalAddress', label: 'Terminal Address'},
    {key:'merchantId', label: 'Merchant ID'},
    {key:'mpan', label: 'Merchant Pan'},
    {key:'merchantName', label: 'Merchant Name'},
    {key:'mcc', label: 'Merchant Category Code'},
    {key:'merchantCriteria', label: 'Merchant Criteria'},
    {key:'merchantCity', label: 'Merchant City'},
    {key:'merchantType', label: 'Merchant Type'},
    {key:'acqInstitCode', label: 'Acquire Institution Code'},
    {key:'issInstitCode', label: 'Issuer Institution Code'},
    {key:'desInstitCode', label: 'Destination Institution Code'},
    {key:'acct1', label: 'Source Account'},
    {key:'acct2', label: 'Destination Account'},


    // {key:'refNo', label: 'No Reference'},
    // {key:'countryCode', label: 'Country Code'},
    // {key:'postalCode', label: 'Postal Code'},

    // {key:'trxDate', label: 'Transaction Date'},
    // {key:'tips', label: 'Fee Transaction'},
    {key:'Invoice', label: 'Invoice'},



  ]


  constructor(

  ) {
  }

  ngOnInit() {
    // console.log(this.addtData)
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  onDialogVisible() {
    this.fetchInformationDetails()
  }

  onClose() {
    this.informationLabelValues = []
    this.closeSelf.emit(false)
  }

  fetchInformationDetails() {
    if (this.selectedItem.size > 0) {
      this.listOfLabel.forEach(data => {
        const fetchedValue = this.getValueFromParent(data.key)
        if (fetchedValue != '')
          this.informationLabelValues.push({label: data.label, value: fetchedValue})
      })
    }
  }

  getValueFromParent(key: string) {
    const obj = this.selectedItem.get(key)
    return obj != undefined ? obj : ''
  }
}
