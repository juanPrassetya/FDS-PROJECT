import {FraudListDomain} from "../../fraud-list/domain/fraud-list.domain";

export class FraudListValueDomain {
  id !: bigint
  value: string = ''
  author: string = ''
  listId!: FraudListDomain
  creationDate: string = ''
}
