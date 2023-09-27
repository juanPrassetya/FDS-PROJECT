import {CustomerDomain} from "./customer-domain/customer.domain";
import {CardDomain} from "./customer-domain/card.domain";
import {AccountDomain} from "./customer-domain/account.domain";

export class AlertInvestigationDemografiDomain {
  id!: bigint
  refnum: string = ''
  utrnno: string = ''
  custNumber!: CustomerDomain
  cardList: Array<CardDomain> = []
  accountList: Array<AccountDomain> = []
}
