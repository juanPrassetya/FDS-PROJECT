import {WhiteListDomain} from "../domain/white-list.domain";
import {StateContext} from "@ngxs/store";
import {FraudListStateModel} from "../../fraud-list/state/fraud-list.state";
import {WhiteListStateModel} from "./white-list.state";

export class WhiteListGet {
  static readonly type = '[WhiteList] FetchWhiteList'
}

export class WhiteListGetQuery {
  static readonly type = '[WhiteList] FetchWhiteListQuery';
  constructor(public data: any) {}
}

export class WhiteListAdd {
  static readonly type = '[WhiteList] WhiteListAdd'

  constructor(
    public data: WhiteListDomain
  ) {
  }
}

export class WhiteListUpdate {
  static readonly type = '[WhiteList] WhiteListUpdate'

  constructor(
    public currentId: number,
    public data: WhiteListDomain
  ) {
  }
}

export class WhiteListDelete {
  static readonly type = '[WhiteList] WhiteListDelete'

  constructor(
    public id: number
  ) {
  }
}

export class WhiteListUpload {
  static readonly type = '[WhiteList] WhiteListUpload'

  constructor(
    public data: {file: any, initiatorId: string, uGroupId: string}
  ) {
  }
}

export class WhiteListGetAllInformation {
  static readonly type = '[WhiteList] WhiteListGetAllInformation'

  constructor(
    public action: (ctx: StateContext<WhiteListStateModel>) => void,
  ) {
  }
}
