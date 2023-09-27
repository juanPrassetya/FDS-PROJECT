import {FraudListValueDomain} from "../domain/fraud-list-value.domain";
import {StateContext} from "@ngxs/store";
import {FraudListValueStateModel} from "./fraud-list-value.state";

export class FraudListValueGetById {
  static readonly type = '[FraudListValue] FraudListValueGetById'

  constructor(
    public id: number
  ) {
  }
}

export class FraudListValueAdd {
  static readonly type = '[FraudListValue] FraudListValueAdd'

  constructor(
    public data: FraudListValueDomain
  ) {
  }
}

export class FraudListValueUpdate {
  static readonly type = '[FraudListValue] FraudListValueUpdate'

  constructor(
    public currentValue: string,
    public data: FraudListValueDomain
  ) {
  }
}

export class FraudListValueDelete {
  static readonly type = '[FraudListValue] FraudListValueDelete'

  constructor(
    public id: number
  ) {
  }
}

export class FraudListValueUpload {
  static readonly type = '[FraudListValue] FraudListValueUpload'

  constructor(
    public data: {file: any, author: string, listId: string}
  ) {
  }
}

export class FraudListValueResetAllInformation {
  static readonly type = '[FraudListValue] FraudListValueResetAllInformation'

  constructor(
    public action: (ctx: StateContext<FraudListValueStateModel>) => void,
  ) {
  }
}
