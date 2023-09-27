import {UserGroupDomain} from "../../user-group/domain/user-group.domain";
import {UserDomain} from "../../user/domain/user.domain";

export class WhiteListDomain {
  id!: bigint
  entityType: string = ''
  value: string = ''
  dateIn: string = ''
  dateOut: string = ''
  reason: string = ''
  userGroup!: UserGroupDomain
  initiator!: UserDomain
}
