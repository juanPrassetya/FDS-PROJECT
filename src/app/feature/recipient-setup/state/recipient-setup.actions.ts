import {RecipientSetupDomain} from "../domain/recipient-setup.domain";
import {StateContext} from "@ngxs/store";
import {RecipientSetupStateModel} from "./recipient-setup.state";

export class RecipientSetupGet {
  static readonly type = '[RecipientSetup] FetchRecipientSetup'
}

export class RecipientSetupGetQuery {
  static readonly type = '[RecipientSetup] FetchRecipientSetupQuery'
  constructor(public data: any) {}
}

export class RecipientSetupAdd {
  static readonly type = '[RecipientSetup] RecipientSetupAdd'
  constructor(
    public data: RecipientSetupDomain
  ) {
  }
}

export class RecipientSetupUpdate {
  static readonly type = '[RecipientSetup] RecipientSetupUpdate'

  constructor(
    public currentId: number,
    public data: RecipientSetupDomain
  ) {
  }
}

export class RecipientSetupDelete {
  static readonly type = '[RecipientSetup] RecipientSetupDelete'

  constructor(
    public id: number
  ) {
  }
}

export class RecipientSetupGetAllInformation {
  static readonly type = '[RecipientSetup] RecipientSetupGetAllInformation'

  constructor(
    public action: (ctx: StateContext<RecipientSetupStateModel>) => void
  ) {
  }
}
