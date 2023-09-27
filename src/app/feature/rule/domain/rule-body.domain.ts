export class RuleBodyDomain {
  id: bigint | undefined
  ruleId: number | undefined
  conditionId: string = ''
  detailCondition: string = ''
  condition: string = ''
  bindingId: bigint | undefined
}
