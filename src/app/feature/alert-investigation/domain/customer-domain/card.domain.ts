import {AccountDomain} from "./account.domain";
import {PersonDomain} from "./person.domain";

export class CardDomain {
  id!: bigint
  cardNumber: string = ''
  cardMask: string = ''
  cardId: string = ''
  cardIssDate: string = ''
  cardStartDate: string = ''
  expirationDate: string = ''
  instanceId: number = 0
  precedingInstanceId: number = 0
  sequentialNumber: number = 0
  cardStatus: string = ''
  cardState: string = ''
  category: string = ''
  pvv: number = 0
  pinOffset: number = 0
  pinUpdateFlag: boolean = false
  cardTypeId: number = 0
  prevCardNumber: string = ''
  prevCardId: string = ''
  agentNumber: string = ''
  agentName: string = ''
  productNumber: string = ''
  productName: string = ''
  companyName: string = ''
  serviceCode: string = ''
  accountList: Array<AccountDomain> = []
  person!: PersonDomain
}
