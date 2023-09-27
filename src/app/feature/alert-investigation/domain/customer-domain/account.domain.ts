import {PersonDomain} from "./person.domain";

export class AccountDomain {
  id!: bigint
  accountNumber: string = ''
  currency: string = ''
  accountType: string = ''
  accountStatus: string = ''
  person!: PersonDomain
}
