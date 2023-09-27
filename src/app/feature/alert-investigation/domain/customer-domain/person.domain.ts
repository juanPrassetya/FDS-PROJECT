import {AddressDomain} from "./address.domain";

export class PersonDomain {
  personId!: bigint
  personTitle: string = ''
  personName: string = ''
  suffix: string = ''
  birthday: string = ''
  placeOfBirth: string = ''
  gender: string = ''
  address!: AddressDomain
  personDetails!: {surname: string, firstName: string, secondName: string}
}
