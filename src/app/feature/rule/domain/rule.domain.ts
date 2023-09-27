import {RuleGroupDomain} from "../../rule-group/domain/rule-group.domain";
import {RuleBodyDomain} from "./rule-body.domain";
import {RuleHistoryDomain} from "./rule-history.domain";

export class RuleDomain {
  ruleId: bigint;
  ruleName: string;
  description: string;
  isActive: boolean;
  status: string = ''
  riskValue: number;
  priority: number;
  dateFrom: string;
  dateTo: string;
  type: number;
  author: string;
  sformula: string;
  ruleBodies: RuleBodyDomain[] = []
  ruleGroup!: RuleGroupDomain


  constructor(ruleId: bigint, ruleName: string, description: string, isActive: boolean, status: string, riskValue: number, priority: number, dateFrom: string, dateTo: string, type: number, author: string, sformula: string, ruleBodies: RuleBodyDomain[], ruleGroup: RuleGroupDomain) {
    this.ruleId = ruleId;
    this.ruleName = ruleName;
    this.description = description;
    this.isActive = isActive;
    this.status = status;
    this.riskValue = riskValue;
    this.priority = priority;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.type = type;
    this.author = author;
    this.sformula = sformula;
    this.ruleBodies = ruleBodies;
    this.ruleGroup = ruleGroup;
  }
}
