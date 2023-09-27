import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RuleGroupDispatcher} from "../state/rule-group.dispatcher";
import {CustomHttpResponse} from "../../../shared/domain/customHttpResponse";
import {RuleGroupDomain} from "../domain/rule-group.domain";
import {RoutePathEnum} from "../../../shared/enum/route-path.enum";
import {StateContext} from "@ngxs/store";
import {RuleGroupStateModel} from "../state/rule-group.state";

@Injectable({
  providedIn: 'root'
})
export class RuleGroupService {
  private apiUrl = environment.dev_env

  constructor(
    private http: HttpClient,
    private ruleGroupDispatcher: RuleGroupDispatcher
  ) { }

  getRuleGroup(uGroupId: number) {
    const params = new HttpParams().set('userGroupId', uGroupId);

    return this.http.get<CustomHttpResponse<RuleGroupDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RULE_GROUP_GET_PATH}`, {params})
  }

  getRuleGroupQuery(data: any) {
    return this.http.post<CustomHttpResponse<RuleGroupDomain[]>>(`${this.apiUrl}/${RoutePathEnum.RULE_GROUP_GET_QUERY_PATH}`, data)
  }

  addRuleGroup(data: RuleGroupDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_GROUP_ADD_PATH}`, data)
  }

  updateRuleGroup(data: RuleGroupDomain) {
    return this.http.post<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_GROUP_UPDATE_PATH}`, data)
  }

  deleteRuleGroup(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(`${this.apiUrl}/${RoutePathEnum.RULE_GROUP_DELETE_PATH}/${id}`)
  }

  onGetRuleGroup(id: number) {
    return this.ruleGroupDispatcher._RuleGroupGet(id)
  }

  onGetRuleGroupQuery(data: any) {
    return this.ruleGroupDispatcher._RuleGroupGetQuery(data);
  }

  onAddRuleGroup(data: RuleGroupDomain) {
    return this.ruleGroupDispatcher._RuleGroupAdd(data)
  }

  onUpdateRuleGroup(data: RuleGroupDomain) {
    return this.ruleGroupDispatcher._RuleGroupUpdate(data)
  }

  onDeleteRuleGroup(id: number) {
    return this.ruleGroupDispatcher._RuleGroupDelete(id)
  }

  onGetAllInformation(action: (ctx: StateContext<RuleGroupStateModel>) => void) {
    return this.ruleGroupDispatcher._RuleGroupGetAllInformation(action)
  }

  onResetAllInformation(action: (ctx: StateContext<RuleGroupStateModel>) => void) {
    return this.ruleGroupDispatcher._RuleGroupResetAllInformation(action)
  }
}
