export class FraudReactionsDomain {
  id!: bigint
  bindingId!: bigint
  bindingType: string = ''
  priority: number = 0
  zone: string = ''
  action: string = ''
  actionValue: string = ''
  description: string = ''
  dateIn: string = '';
  dateOut: string = '';
}
