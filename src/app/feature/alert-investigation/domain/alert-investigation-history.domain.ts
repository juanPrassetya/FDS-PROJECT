export class AlertInvestigationHistoryDomain {
  id!: bigint
  actionType: string = ''
  actionDate: string = ''
  initiator: string = ''
  info: string = ''
  caseId!: bigint
}
