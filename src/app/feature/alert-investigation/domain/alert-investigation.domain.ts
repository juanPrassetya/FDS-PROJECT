import {UserDomain} from "../../user/domain/user.domain";
import {RuleDomain} from "../../rule/domain/rule.domain";

export class AlertInvestigationDomain {
  caseId!: bigint
  utrnno!: bigint
  hpan: string = ''
  initiator: string = ''
  clasifiedComment: string = ''
  classifiedDate: string = ''
  actionDate: string = ''
  lastUpdate: string = ''
  clasificationType: number = 0
  actionType: number = 0
  isClassified: boolean = false
  isActioned: boolean = false
  isForwarded: boolean = false
  forwardedTo!: bigint
  isLocked: boolean = false
  lockedBy: string = ''
  caseComment: string = ''
  rulesTriggeredId: RuleDomain[] = []

  listId: string = ''
  value: string = ''

  reason: string = ''
  entityType: string = ''
  datein: string = ''
  dateout: string = ''
  userGroupId: string = ''
}
