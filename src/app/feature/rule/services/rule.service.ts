import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RuleDomain} from "../domain/rule.domain";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {RuleDispatcher} from "../state/rule.dispatcher";
import {AggregateDomain} from "../domain/aggregate.domain";
import {RuleHistoryDomain} from "../domain/rule-history.domain";
import {StateContext} from "@ngxs/store";
import {RuleStateModel} from "../state/rule.state";

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private apiUrl = environment.dev_env
  constructor(
    private http: HttpClient,
    private ruleDispatcher: RuleDispatcher
  ) {
  }

  fetchAllRules(id: number) {
    const params = new HttpParams().set('userGroupId', id);

    return this.http.get<CustomHttpResponse<Array<RuleDomain>>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_PATH}`, {params});
  }

  fetchAllRulesQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_QUERY_PATH}`, data);
  }

  fetchRuleById(id: number) {
    const params = new HttpParams().set('ruleId', id);

    return this.http.get<CustomHttpResponse<RuleDomain>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_BY_ID_PATH}`, {params})
  }

  fetchRuleByGroupId(id: number) {
    const params = new HttpParams().set('groupId', id);

    return this.http.get<CustomHttpResponse<RuleDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_BY_GROUP_ID_PATH}`, {params})
  }

  fetchRuleHistoryByRuleId(id: number) {
    const params = new HttpParams().set('ruleId', id);

    return this.http.get<CustomHttpResponse<RuleHistoryDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RULE_HISTORY_GET_BY_ID_PATH}`, {params})
  }

  fetchAllAggregate() {
    return this.http.get<CustomHttpResponse<Array<AggregateDomain>>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_AGGREGATE_PATH}`);
  }

  fetchAggregateByQuery(name: string) {
    return this.http.post<CustomHttpResponse<[]>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_AGGREGATE_BY_QUERY_PATH}`, name);
  }

  fetchAggregateById(id: number) {
    return this.http.get<CustomHttpResponse<AggregateDomain>>(`${this.apiUrl}/${RoutePathEnum.RULE_GET_AGGREGATE_BY_ID_PATH}/${id}`);
  }

  addRule(data: RuleDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_ADD_PATH}`, data)
  }

  addAggregate(data: AggregateDomain) {
    return this.http.post<CustomHttpResponse<AggregateDomain>>(`${this.apiUrl}/${RoutePathEnum.RULE_ADD_AGGREGATE_PATH}`, data)
  }

  updateRule(data: RuleDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_UPDATE_PATH}`, data)
  }

  updateAggregate(currentId: number, data: AggregateDomain) {
    const params = new HttpParams().set('currentId', currentId)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_UPDATE_AGGREGATE_PATH}`, data, {params})
  }

  deleteRule(id: number) {
    return this.http.delete<CustomHttpResponse<RuleDomain>>(`${this.apiUrl}/${RoutePathEnum.RULE_DELETE_PATH}/${id}`)
  }

  activationRule(ruleId: number, initiator: string, comment: string){
    const params = new HttpParams()
      .set('ruleId', ruleId)
      .append('initiator', initiator)
      .append('comment', comment)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_ACTIVATION_PATH}`, {},{params})
  }

  deactivationRule(ruleId: number, initiator: string, comment: string){
    const params = new HttpParams()
      .set('ruleId', ruleId)
      .append('initiator', initiator)
      .append('comment', comment)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_DEACTIVATION_PATH}`, {}, {params})
  }

  approveRule(ruleId: number, initiator: string, comment: string){
    const params = new HttpParams()
      .set('ruleId', ruleId)
      .append('initiator', initiator)
      .append('comment', comment)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_APPROVE_PATH}`, {}, {params})
  }

  rejectRule(ruleId: number, initiator: string, comment: string){
    const params = new HttpParams()
      .set('ruleId', ruleId)
      .append('initiator', initiator)
      .append('comment', comment)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_REJECT_PATH}`, {}, {params})
  }

  importRule(file: any) {
    const formData = new FormData()
    formData.set('file', file, file.name)

    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_IMPORT_PATH}`, formData)
  }

  exportRule(listId: number[]) {
    return this.http.post<any>(`${this.apiUrl}/${RoutePathEnum.RULE_EXPORT_PATH}`, listId, {responseType: 'arraybuffer' as 'json'})
  }

  onFetchAllRule(id: number) {
    this.ruleDispatcher._FetchAllRules(id)
  }

  onFetchAllRuleQuery(data: any) {
    this.ruleDispatcher._FetchAllRulesQuery(data)
  }

  onFetchRuleById(id: number) {
    this.ruleDispatcher._FetchRuleById(id)
  }

  onFetchRuleByGroupId(id: number) {
    this.ruleDispatcher._FetchRuleByGroupId(id)
  }

  onFetchRuleHistoryByRuleId(id: number) {
    this.ruleDispatcher._FetchRuleHistoryByRuleId(id)
  }

  onFetchAllAggregate() {
    this.ruleDispatcher._FetchRuleAggregate()
  }

  onFetchAggregateByQuery(name: string) {
    this.ruleDispatcher._FetchRuleAggregateByQuery(name)
  }

  onFetchAggregateById(id: number) {
    this.ruleDispatcher._FetchRuleAggregateById(id)
  }

  onAddRule(data: RuleDomain) {
    this.ruleDispatcher._RuleAdd(data)
  }

  onAddAggregate(data: AggregateDomain) {
    this.ruleDispatcher._RuleAddAggregate(data)
  }

  onUpdateRule(data: RuleDomain) {
    this.ruleDispatcher._RuleUpdate(data)
  }

  onUpdateAggregate(currentId: number, data: AggregateDomain) {
    this.ruleDispatcher._RuleUpdateAggregate(currentId, data)
  }

  onDeleteRule(id: number) {
    this.ruleDispatcher._RuleDeleteById(id)
  }

  onActivationRule(ruleId: number, initiator: string, comment: string) {
    this.ruleDispatcher._RuleActivation(ruleId, initiator, comment)
  }

  onDeactivationRule(ruleId: number, initiator: string, comment: string) {
    this.ruleDispatcher._RuleDeactivation(ruleId, initiator, comment)
  }

  onApproveRule(ruleId: number, initiator: string, comment: string) {
    this.ruleDispatcher._RuleApprove(ruleId, initiator, comment)
  }

  onRejectRule(ruleId: number, initiator: string, comment: string) {
    this.ruleDispatcher._RuleReject(ruleId, initiator, comment)
  }

  onImportRule(file: any) {
    this.ruleDispatcher._RuleImport(file)
  }

  onExportRule(listId: number[]) {
    this.ruleDispatcher._RuleExport(listId)
  }

  onResetAggregate() {
    this.ruleDispatcher._ResetAggregate()
  }

  onGetAllInformation(action: (ctx: StateContext<RuleStateModel>) => void) {
    this.ruleDispatcher._RuleGetAllInformation(action)
  }

  onResetAllInformation(action: (ctx: StateContext<RuleStateModel>) => void) {
    this.ruleDispatcher._RuleResetAllInformation(action)
  }
}
