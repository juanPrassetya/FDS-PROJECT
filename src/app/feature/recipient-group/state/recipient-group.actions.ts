import {RecipientGroupDomain} from "../domain/recipient-group.domain";
import {StateContext} from "@ngxs/store";
import {RecipientGroupStateModel} from "./recipient-group.state";

export class RecipientGroupGet {
  static readonly type = '[RecipientGroup] FetchRecipientGroup'
}

export class RecipientGroupGetQuery {
  static readonly type = '[RecipientGroup] FetchRecipientGroupQuery'
  constructor(public data: any) {}
}

export class RecipientGroupAdd {
  static readonly type = '[RecipientGroup] RecipientGroupAdd'
  constructor(
    public data: RecipientGroupDomain
  ) {
  }
}

export class RecipientGroupUpdate {
  static readonly type = '[RecipientGroup] RecipientGroupUpdate'

  constructor(
    public currentId: number,
    public data: RecipientGroupDomain
  ) {
  }
}

export class RecipientGroupDelete {
  static readonly type = '[RecipientGroup] RecipientGroupDelete'

  constructor(
    public id: number
  ) {
  }
}

export class RecipientGroupGetAllInformation {
  static readonly type = '[RecipientGroup] RecipientGroupGetAllInformation'

  constructor(
    public action: (ctx: StateContext<RecipientGroupStateModel>) => void
  ) {
  }
}
