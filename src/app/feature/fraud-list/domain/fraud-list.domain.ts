import {UserGroupDomain} from "../../user-group/domain/user-group.domain";
import {FraudListTypeDomain} from "../../fraud-list-type/domain/fraud-list-type.domain";

export class FraudListDomain {
  listId!: bigint
  listName: string = ''
  userGroup!: UserGroupDomain
  entityType!: FraudListTypeDomain
}
