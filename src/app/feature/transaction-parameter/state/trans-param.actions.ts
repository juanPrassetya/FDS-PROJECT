import { TransParamDomain } from "../domain/trans-param.domain"
import {StateContext} from "@ngxs/store";
import {ExtIntJsonStateModel} from "../../ext-int-json/state/ext-int-json.state";
import {TransParamStateModel} from "./trans-param.state";

export class TransParamGet {
  static readonly type = '[TransParam] FetchAllTransParam'
}

export class TransParamGetByEndpoint {
  static readonly type = '[TransParam] FetchAllTransParamByEndpoint'
  constructor(public id: number) {}
}

export class TransParamGetById {
  static readonly type = '[TransParam] FetchAllTransParamById'
  constructor(public id: number) {}
}

export class TransParamGetQuery {
  static readonly type = '[TransParam] FetchAllTransParamQuery'
  constructor(public data: any) {}
}

export class TransParamGetCommon {
  static readonly type = '[TransParam] FetchAllTransParamCommon'
}

export class TransParamAdd {
  static readonly type = '[TransParam] Add'
  constructor(public payload: TransParamDomain) {}
}

export class TransParamUpdate {
  static readonly type = '[TransParam] Update';
  constructor(public payload: TransParamDomain) {}
}

export class TransParamDelete {
  static readonly type = '[TransParam] Delete';
  constructor(public id: number) {}
}

export class ResetTransParamById {
  static readonly type = '[TransParam] ResetTransParamById'
}

export class TransParamResetAllInformation {
  static readonly type = '[TransParam] ResetAllInformation'

  constructor(
    public action: (ctx: StateContext<TransParamStateModel>) => void
  ) {
  }
}
