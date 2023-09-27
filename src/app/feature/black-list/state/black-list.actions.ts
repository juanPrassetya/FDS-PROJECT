import {BlackListDomain} from "../domain/black-list.domain";
import {StateContext} from "@ngxs/store";
import {WhiteListStateModel} from "../../white-list/state/white-list.state";
import {BlackListStateModel} from "./black-list.state";

export class BlackListGet {
  static readonly type = '[BlackList] FetchBlackList'
}

export class BlackListGetQuery {
  static readonly type = '[BlackList] FetchBlackListQuery'
  constructor(public data: any) {}
}

export class BlackListAdd {
  static readonly type = '[BlackList] BlackListAdd'
  constructor(
    public data: BlackListDomain
  ) {
  }
}

export class BlackListUpdate {
  static readonly type = '[BlackList] BlackListUpdate'

  constructor(
    public currentId: number,
    public data: BlackListDomain
  ) {
  }
}

export class BlackListDelete {
  static readonly type = '[BlackList] BlackListDelete'

  constructor(
    public id: number
  ) {
  }
}

export class BlackListUpload {
  static readonly type = '[BlackList] BlackListUpload'

  constructor(
    public data: {file: any, initiatorId: string, uGroupId: string}
  ) {
  }
}

export class BlackListGetAllInformation {
  static readonly type = '[BlackList] BlackListGetAllInformation'

  constructor(
    public action: (ctx: StateContext<BlackListStateModel>) => void,
  ) {
  }
}
