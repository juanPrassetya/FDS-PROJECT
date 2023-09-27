import { TransactionTypeDomain } from "../domain/transaction-type.domain";

export class TransactionTypeGet {
    static readonly type = '[TransactionType] Get';
    constructor(public id: number) {}
  }

  export class TransactionTypeGetQuery {
    static readonly type = '[TransactionType] GetQuery';
    constructor(public data: any) {}
  }
  
  export class TransactionTypeAdd {
    static readonly type = '[TransactionType] Add';
    constructor(public payload: TransactionTypeDomain) {}
  }
  
  export class TransactionTypeDelete {
    static readonly type = '[TransactionType] Delete';
    constructor(public id: number) {}
  }
  
  export class TransactionTypeUpdate {
    static readonly type = '[TransactionType] Update';
    constructor(public payload: TransactionTypeDomain) {}
  }