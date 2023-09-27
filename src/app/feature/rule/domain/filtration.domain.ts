export class FiltrationDomain {
  filtrationId!: bigint
  conditionId: string = ''
  operator: string | undefined = ''
  operatorDetails: string = ''
  attribute: string = ''
  value: string = ''
  isRange: boolean = false
  minRange: string = ''
  maxRange: string = ''
}
