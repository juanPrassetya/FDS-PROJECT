import {FraudListDomain} from "../domain/fraud-list.domain";
import {StateContext} from "@ngxs/store";
import {FraudListStateModel} from "./fraud-list.state";

export class FraudListGet {
  static readonly type = '[FraudList] FetchFraudList'
}

export class FraudListGetQuery {
  static readonly type = '[FraudList] FetchFraudListQuery'
  constructor(public data: any) {}
}

export class FraudListGetByEntity {
  static readonly type = '[FraudList] FetchFraudListByEntity'

  constructor(
    public entity: number
  ) {
  }
}

export class FraudListAdd {
  static readonly type = '[FraudList] FraudListAdd'

  constructor(
    public data: FraudListDomain
  ) {
  }
}

export class FraudListUpdate {
  static readonly type = '[FraudList] FraudListUpdate'

  constructor(
    public currentListName: string,
    public data: FraudListDomain
  ) {
  }
}

export class FraudListDelete {
  static readonly type = '[FraudList] FraudListDelete'

  constructor(
    public id: number
  ) {
  }
}

export class FraudListGetAllInformation {
  static readonly type = '[FraudList] FraudListGetAllInformation'

  constructor(
    public action: (ctx: StateContext<FraudListStateModel>) => void,
  ) {
  }
}

export class FraudListResetAllInformation {
  static readonly type = '[FraudList] FraudListResetAllInformation'

  constructor(
    public action: (ctx: StateContext<FraudListStateModel>) => void,
  ) {
  }
}
