import {TransactionDomain} from "../domain/transaction.domain";
import {StateContext} from "@ngxs/store";
import {TransactionStateModel} from "./transaction.state";

export class TransactionGet {
  static readonly type = '[Transaction] FetchAllTransaction'
}

export class TransactionGetByQuery {
  static readonly type = '[Transaction] FetchTransactionByQuery'
  constructor(public data: any[]) {}
}

export class TransactionGetByHpan {
  static readonly type = '[Transaction] FetchAllTransactionByHpan'

  constructor(
    public data: {hpan: string, custId: string, acct1: string, alertDate: string}
  ) {
  }
}

export class TransactionGetTriggeredRule {
  static readonly type = '[Transaction] FetchAllTransactionTriggeredRule'

  constructor(
    public utrnno: string,
  ) {
  }
}

export class TransactionGetAddtData {
  static readonly type = '[Transaction] FetchAllTransactionAddtData'

  constructor(
    public utrnno: string,
  ) {
  }
}

export class TransactionGetAllInformation {
  static readonly type = '[Transaction] FetchAllTransactionInformation'

  constructor(
    public action: (ctx: StateContext<TransactionStateModel>) => void,
  ) {
  }
}

export class TransactionAssignFraudFlag {
  static readonly type = '[Transaction] TransactionAssignFraudFlag'

  constructor(
    public data: TransactionDomain
  ) {
  }
}

export class TransactionResetAllInformation {
  static readonly type = `[Transaction] TransactionResetAllInformation`

  constructor(
    public action: (ctx: StateContext<TransactionStateModel>) => void,
  ) {
  }
}
