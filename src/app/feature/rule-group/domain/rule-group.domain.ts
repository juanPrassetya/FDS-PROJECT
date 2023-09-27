import {UserGroupDomain} from "../../user-group/domain/user-group.domain";

export class RuleGroupDomain {
  id!: bigint
  groupName: string = ''
  threshouldBlack: number = 0
  threshouldGrey: number = 0
  priority: number = 0
  isActive: boolean = false
  isForcedReaction: boolean = false
  userGroup!: UserGroupDomain
}
