import {FraudReactionsDomain} from "../domain/fraud-reactions.domain";
import {StateContext} from "@ngxs/store";
import {FraudReactionStateModel} from "./fraud-reactions.state";

export class FraudReactionsGet {
  static readonly type = '[FraudReactions] FetchFraudReactions'
}

export class FraudReactionsGetQuery {
  static readonly type = '[FraudReactions] FetchFraudReactionsQuery'
  constructor(public data: any) {}
}

export class FraudReactionsGetByBindingIdAndType {
  static readonly type = '[FraudReactions] FetchFraudReactionsByBindingIdAndType'

  constructor(
    public id: number,
    public type: string
  ) {
  }
}


export class FraudReactionsAdd {
  static readonly type = '[FraudReactions] FraudReactionsAdd'

  constructor(
    public data: FraudReactionsDomain
  ) {
  }
}

export class FraudReactionsUpdate {
  static readonly type = '[FraudReactions] FraudReactionsUpdate'

  constructor(
    public data: FraudReactionsDomain
  ) {
  }
}

export class FraudReactionsDelete {
  static readonly type = '[FraudReactions] FraudReactionsDelete'

  constructor(
    public id: number
  ) {
  }
}

export class FraudReactionsGetAllInformation {
  static readonly type = '[FraudReactions] FraudReactionsGetAllInformation'

  constructor(
    public action: (ctx: StateContext<FraudReactionStateModel>) => void,
  ) {
  }
}

export class FraudReactionsResetState {
  static readonly type = '[FraudReactions] FraudReactionsResetState'

  constructor(
    public action: (ctx: StateContext<FraudReactionStateModel>) => void,
  ) {
  }
}
