import {RuleGroupDomain} from "../domain/rule-group.domain";
import {StateContext} from "@ngxs/store";
import {WhiteListStateModel} from "../../white-list/state/white-list.state";
import {RuleGroupStateModel} from "./rule-group.state";

export class RuleGroupGet {
  static readonly type = '[RuleGroup] FetchRuleGroup'

  constructor(
    public id: number
  ) {
  }
}

export class RuleGroupGetQuery {
  static readonly type = '[RuleGroup] FetchRuleGroupQuery'
  constructor(public data: any) {}
}

export class RuleGroupAdd {
  static readonly type = '[RuleGroup] RuleGroupAdd'

  constructor(
    public data: RuleGroupDomain
  ) {
  }
}

export class RuleGroupUpdate {
  static readonly type = '[RuleGroup] RuleGroupUpdate'

  constructor(
    public data: RuleGroupDomain
  ) {
  }
}

export class RuleGroupDelete {
  static readonly type = '[RuleGroup] RuleGroupDelete'

  constructor(
    public id: number
  ) {
  }
}

export class RuleGroupGetAllInformation {
  static readonly type = '[RuleGroup] FetchRuleGroupAllInformation'

  constructor(
    public action: (ctx: StateContext<RuleGroupStateModel>) => void
  ) {
  }
}

export class RuleGroupResetAllInformation {
  static readonly type = '[RuleGroup] RuleGroupResetAllInformation'

  constructor(
    public action: (ctx: StateContext<RuleGroupStateModel>) => void
  ) {
  }
}
