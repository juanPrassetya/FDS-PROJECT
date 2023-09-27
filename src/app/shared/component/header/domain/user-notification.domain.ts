export class UserNotificationDomain {
  id!: bigint
  initiator: string = ''
  notificationType: string = ''
  messageType: string = ''
  reicipientMessage: string = ''
  dateOccurance: string = ''
  description: string = ''
}
