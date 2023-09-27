import {UserGroupDomain} from "../../user-group/domain/user-group.domain";
import {UserDomain} from "../../user/domain/user.domain";

export class BlackListDomain {
  id!: bigint
  entityType: string = ''
  value: string = ''
  dateIn: string = ''
  dateOut: string = ''
  reason: string = ''
  userGroup!: UserGroupDomain
  initiator!: UserDomain
}
