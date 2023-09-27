import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
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
import {RuleDomain} from "../domain/rule.domain";
import {AggregateDomain} from "../domain/aggregate.domain";
import {StateContext} from "@ngxs/store";
import {RuleStateModel} from "./rule.state";

@Injectable({
  providedIn: 'root'
})
export class RuleDispatcher {

  @Dispatch()
  public _FetchAllRules(id: number) {
    return new RuleGet(id);
  }

  @Dispatch()
  public _FetchAllRulesQuery(data: any) {
    return new RuleGetQuery(data);
  }

  @Dispatch()
  public _FetchRuleById(id: number) {
    return new RuleGetById(id);
  }

  @Dispatch()
  public _FetchRuleByGroupId(id: number) {
    return new RuleGetByGroupId(id);
  }

  @Dispatch()
  public _FetchRuleAggregate() {
    return new RuleGetAggregate()
  }

  @Dispatch()
  public _FetchRuleAggregateByQuery(name: string) {
    return new RuleGetAggregateByQuery(name)
  }

  @Dispatch()
  public _FetchRuleAggregateById(id: number) {
    return new RuleGetAggregateById(id)
  }

  @Dispatch()
  public _FetchRuleHistoryByRuleId(id: number) {
    return new RuleHistoryGetByRuleId(id);
  }

  @Dispatch()
  public _RuleAdd(data: RuleDomain) {
    return new RuleAdd(data)
  }

  @Dispatch()
  public _RuleAddAggregate(data: AggregateDomain) {
    return new RuleAddAggregate(data)
  }

  @Dispatch()
  public _RuleUpdate(data: RuleDomain) {
    return new RuleUpdate(data)
  }

  @Dispatch()
  public _RuleUpdateAggregate(currentId: number, data: AggregateDomain) {
    return new RuleUpdateAggregate(currentId, data)
  }

  @Dispatch()
  public _RuleDeleteById(id: number) {
    return new RuleDeleteById(id)
  }

  @Dispatch()
  public _RuleActivation(ruleId: number, initiator: string, comment: string) {
    return new RuleActivation(ruleId, initiator, comment)
  }

  @Dispatch()
  public _RuleDeactivation(ruleId: number, initiator: string, comment: string) {
    return new RuleDeactivation(ruleId, initiator, comment)
  }

  @Dispatch()
  public _RuleApprove(ruleId: number, initiator: string, comment: string) {
    return new RuleApprove(ruleId, initiator, comment)
  }

  @Dispatch()
  public _RuleReject(ruleId: number, initiator: string, comment: string) {
    return new RuleReject(ruleId, initiator, comment)
  }

  @Dispatch()
  public _RuleImport(file: any) {
    return new RuleImport(file)
  }

  @Dispatch()
  public _RuleExport(listId: number[]) {
    return new RuleExport(listId)
  }

  @Dispatch()
  public _ResetRuleById() {
    return new ResetRuleById()
  }

  @Dispatch()
  public _ResetAggregate() {
    return new ResetAggregate()
  }

  @Dispatch()
  public _RuleGetAllInformation(action: (ctx: StateContext<RuleStateModel>) => void) {
    return new RuleGetAllInformation(action)
  }

  @Dispatch()
  public _RuleResetAllInformation(action: (ctx: StateContext<RuleStateModel>) => void) {
    return new RuleResetAllInformation(action)
  }
}
