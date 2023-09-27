import {RuleDomain} from "../domain/rule.domain";
import {AggregateDomain} from "../domain/aggregate.domain";
import {StateContext} from "@ngxs/store";
import {RuleStateModel} from "./rule.state";

export class RuleGet {
  static readonly type = '[Rule] FetchAllRule'

  constructor(public id: number) {
  }
}

export class RuleGetQuery {
  static readonly type = '[Rule] FetchAllRuleQuery'
  constructor(public data: any) {
  }
}

export class RuleGetById {
  static readonly type = '[Rule] FetchRuleById'
  constructor(public id: number) {
  }
}

export class RuleGetByGroupId {
  static readonly type = '[Rule] FetchRuleByGroupId'
  constructor(public id: number) {
  }
}

export class RuleGetAggregate {
  static readonly type = '[Rule] FetchRuleAggregate'
}

export class RuleGetAggregateByQuery {
  static readonly type = '[Rule] FetchRuleAggregateByQuery'
  constructor(public name: string) {}
}

export class RuleGetAggregateById {
  static readonly type = '[Rule] FetchRuleAggregateById'

  constructor(
    public id: number
  ) {
  }
}

export class RuleHistoryGetByRuleId {
  static readonly type = '[Rule] FetchRuleHistoryByRuleId'
  constructor(public id: number) {
  }
}

export class RuleAdd {
  static readonly type = '[Rule] RuleAdd'

  constructor(public data: RuleDomain) {
  }
}

export class RuleAddAggregate {
  static readonly type = '[Rule] RuleAddAggregate'

  constructor(public data: AggregateDomain) {
  }
}

export class RuleUpdate {
  static readonly type = '[Rule] RuleUpdate'

  constructor(public data: RuleDomain) {
  }
}

export class RuleUpdateAggregate {
  static readonly type = '[Rule] RuleUpdateAggregate'

  constructor(
    public currentId: number,
    public data: AggregateDomain
  ) {
  }
}

export class RuleDeleteById {
  static readonly type = '[Rule] DeleteRuleById'
  constructor(public id: number) {
  }
}

export class RuleActivation {
  static readonly type = '[Rule] RuleActivation'
  constructor(
    public ruleId: number,
    public initiator: string,
    public comment: string
  ) {
  }
}

export class RuleDeactivation {
  static readonly type = '[Rule] RuleDeactivation'
  constructor(
    public ruleId: number,
    public initiator: string,
    public comment: string
  ) {
  }
}

export class RuleApprove {
  static readonly type = '[Rule] RuleApprove'
  constructor(
    public ruleId: number,
    public initiator: string,
    public comment: string
  ) {
  }
}

export class RuleReject {
  static readonly type = '[Rule] RuleReject'
  constructor(
    public ruleId: number,
    public initiator: string,
    public comment: string
  ) {
  }
}

export class RuleImport {
  static readonly type = '[Rule] RuleImport'
  constructor(
    public file: any
  ) {
  }
}

export class RuleExport {
  static readonly type = '[Rule] RuleExport'
  constructor(
    public listId: number[]
  ) {
  }
}

export class ResetRuleById {
  static readonly type = '[Rule] ResetRuleById'
}

export class ResetAggregate {
  static readonly type = '[Rule] ResetAggregate'
}

export class RuleGetAllInformation {
  static readonly type = '[Rule] RuleGetAllInformation'

  constructor(
    public action: (ctx: StateContext<RuleStateModel>) => void,
  ) {
  }
}

export class RuleResetAllInformation {
  static readonly type = '[Rule] ResetAllInformation'

  constructor(
    public action: (ctx: StateContext<RuleStateModel>) => void,
  ) {
  }
}
