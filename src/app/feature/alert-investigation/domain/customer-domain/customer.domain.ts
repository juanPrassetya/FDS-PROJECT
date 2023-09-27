import {CardDomain} from "./card.domain";
import {AccountDomain} from "./account.domain";
import {PersonDomain} from "./person.domain";

export class CustomerDomain {
  id!: bigint
  custNumber: string = ''
  custCategory: string = ''
  custRelation: string = ''
  resident: number = 0
  nationality: number = 0
  creditRating: string = ''
  moneyLaundryRisk: string = ''
  moneyLaundryReason: string = ''
  entityType: string = ''
  cardList: Array<CardDomain> = []
  accountList: Array<AccountDomain> = []
  person!: PersonDomain
}
