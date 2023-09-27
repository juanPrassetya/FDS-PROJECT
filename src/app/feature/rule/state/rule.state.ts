import {RuleDomain} from "../domain/rule.domain";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {
  ResetAggregate,
  ResetRuleById, RuleActivation,
  RuleAdd, RuleAddAggregate, RuleApprove, RuleDeactivation,
  RuleDeleteById, RuleExport,
  RuleGet,
  RuleGetAggregate, RuleGetAggregateById, RuleGetAggregateByQuery, RuleGetAllInformation,
  RuleGetByGroupId,
  RuleGetById, RuleGetQuery, RuleHistoryGetByRuleId, RuleImport, RuleReject, RuleResetAllInformation,
  RuleUpdate, RuleUpdateAggregate
} from "./rule.actions";
import {RuleService} from "../services/rule.service";
import {tap} from "rxjs";
import {NotificationService} from "../../../shared/services/notification.service";
import {AggregateDomain} from "../domain/aggregate.domain";
import {RuleHistoryDomain} from "../domain/rule-history.domain";

export class RuleStateModel {
  rules: RuleDomain[] = [];
  rule: RuleDomain | any;
  ruleByGroupId: RuleDomain[] = [];
  ruleHistory: RuleHistoryDomain[] = [];
  aggregates: AggregateDomain[] = [];
  aggregate: AggregateDomain | undefined
}

@State<RuleStateModel>({
  name: 'ruleState',
  defaults: {
    rules: [],
    rule: undefined,
    ruleByGroupId: [],
    ruleHistory: [],
    aggregates: [],
    aggregate: undefined
  }
})

@Injectable()
export class RuleState {

  constructor(
    private ruleService: RuleService,
    private notificationService: NotificationService
  ) {
  }

  @Selector()
  static rules(state: RuleStateModel) {
    return state.rules;
  }

  @Selector()
  static rule(state: RuleStateModel) {
    return state.rule;
  }

  @Selector()
  static ruleByGroupId(state: RuleStateModel) {
    return state.ruleByGroupId;
  }

  @Selector()
  static ruleHistoryByRuleId(state: RuleStateModel) {
    return state.ruleHistory;
  }

  @Selector()
  static aggregates(state: RuleStateModel) {
    return state.aggregates;
  }

  @Selector()
  static aggregate(state: RuleStateModel) {
    return state.aggregate;
  }

  @Action(RuleGet, {cancelUncompleted: true})
  getData(ctx: StateContext<RuleStateModel>, {id}: RuleGet) {
    return this.ruleService.fetchAllRules(id).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          rules: response.responseData,
        })
      })
    )
  }

  @Action(RuleGetQuery, {cancelUncompleted: true})
  getDataQuery(ctx: StateContext<RuleStateModel>, {data}: RuleGetQuery) {
    return this.ruleService.fetchAllRulesQuery(data).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          rules: response.responseData,
        })
      })
    )
  }

  @Action(RuleGetById, {cancelUncompleted: true})
  getDataById(ctx: StateContext<RuleStateModel>, {id}: RuleGetById) {
    return this.ruleService.fetchRuleById(id).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          rule: response.responseData,
        })
      })
    )
  }

  @Action(RuleGetByGroupId, {cancelUncompleted: true})
  getDataByGroupId(ctx: StateContext<RuleStateModel>, {id}: RuleGetByGroupId) {
    return this.ruleService.fetchRuleByGroupId(id).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          ruleByGroupId: response.responseData,
        })
      })
    )
  }

  @Action(RuleHistoryGetByRuleId, {cancelUncompleted: true})
  getDataByRuleId(ctx: StateContext<RuleStateModel>, {id}: RuleHistoryGetByRuleId) {
    return this.ruleService.fetchRuleHistoryByRuleId(id).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          ruleHistory: response.responseData,
        })
      })
    )
  }

  @Action(RuleGetAggregate, {cancelUncompleted: true})
  getDataAggregate(ctx: StateContext<RuleStateModel>) {
    return this.ruleService.fetchAllAggregate().pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          aggregates: response.responseData,
        })
      })
    )
  }

  @Action(RuleGetAggregateByQuery, {cancelUncompleted: true})
  getDataAggregateByQuery(ctx: StateContext<RuleStateModel>, {name}: RuleGetAggregateByQuery) {
    return this.ruleService.fetchAggregateByQuery(name).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          aggregates: response.responseData,
        })
      })
    )
  }

  @Action(RuleGetAggregateById, {cancelUncompleted: true})
  getDataAggregateById(ctx: StateContext<RuleStateModel>, {id}: RuleGetAggregateById) {
    return this.ruleService.fetchAggregateById(id).pipe(
      tap(response => {
        ctx.setState({
          ...ctx.getState(),
          aggregate: response.responseData,
        })
      })
    )
  }

  @Action(RuleAdd, {cancelUncompleted: true})
  addData(ctx: StateContext<RuleStateModel>, {data}: RuleAdd) {
    return this.ruleService.addRule(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleAddAggregate, {cancelUncompleted: true})
  addAggregate(ctx: StateContext<RuleStateModel>, {data}: RuleAddAggregate) {
    return this.ruleService.addAggregate(data).pipe(
      tap(
        response => {
          ctx.setState({
            ...ctx.getState(),
            aggregate: response.responseData,
          })
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleUpdate, {cancelUncompleted: true})
  updateData(ctx: StateContext<RuleStateModel>, {data}: RuleUpdate) {
    return this.ruleService.updateRule(data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleUpdateAggregate, {cancelUncompleted: true})
  updateAggregate(ctx: StateContext<RuleStateModel>, {currentId, data}: RuleUpdateAggregate) {
    return this.ruleService.updateAggregate(currentId, data).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleDeleteById, {cancelUncompleted: true})
  deleteDataById(ctx: StateContext<RuleStateModel>, {id}: RuleDeleteById) {
    return this.ruleService.deleteRule(id).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleActivation, {cancelUncompleted: true})
  activationRule(ctx: StateContext<RuleStateModel>, {ruleId, initiator, comment}: RuleActivation) {
    return this.ruleService.activationRule(ruleId, initiator, comment).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleDeactivation, {cancelUncompleted: true})
  deactivationRule(ctx: StateContext<RuleStateModel>, {ruleId, initiator, comment}: RuleDeactivation) {
    return this.ruleService.deactivationRule(ruleId, initiator, comment).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleApprove, {cancelUncompleted: true})
  approveRule(ctx: StateContext<RuleStateModel>, {ruleId, initiator, comment}: RuleApprove) {
    return this.ruleService.approveRule(ruleId, initiator, comment).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleReject, {cancelUncompleted: true})
  rejectRule(ctx: StateContext<RuleStateModel>, {ruleId, initiator, comment}: RuleReject) {
    return this.ruleService.rejectRule(ruleId, initiator, comment).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleImport, {cancelUncompleted: true})
  importRule(ctx: StateContext<RuleStateModel>, {file}: RuleImport) {
    return this.ruleService.importRule(file).pipe(
      tap(
        response => {
          this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(RuleExport, {cancelUncompleted: true})
  exportRule(ctx: StateContext<RuleStateModel>, {listId}: RuleExport) {
    return this.ruleService.exportRule(listId).pipe(
      tap(
        response => {
          let file: any
          var anchor = document.createElement("a");
          const currentDateTime = new Date().toLocaleString().replace(/[/:]/g, '-');
          file = new Blob([response], { type: 'application/text' });
          anchor.download = `Rule - ${currentDateTime}.txt`;
          anchor.href = URL.createObjectURL(file);
          anchor.click();
        },

        error => {
          if (error.status != 401) this.notificationService.errorHttpNotification(error)
        }
      )
    )
  }

  @Action(ResetRuleById, {cancelUncompleted: true})
  resetDataById(ctx: StateContext<RuleStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      ruleByGroupId: [],
    })
  }

  @Action(ResetAggregate, {cancelUncompleted: true})
  resetAggregate(ctx: StateContext<RuleStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      aggregate: undefined,
    })
  }

  @Action(RuleGetAllInformation, {cancelUncompleted: true})
  getAllInformation(ctx: StateContext<RuleStateModel>, {action}: RuleGetAllInformation) {
    action(ctx)
  }

  @Action(RuleResetAllInformation, {cancelUncompleted: true})
  resetAllInformation(ctx: StateContext<RuleStateModel>, {action}: RuleResetAllInformation) {
    action(ctx)
  }
}
