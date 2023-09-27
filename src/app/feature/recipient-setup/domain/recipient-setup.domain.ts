import {NotifTypeDomain} from "../../notification-type/domain/notif-type.domain";

export class RecipientSetupDomain {
  recipientId!: bigint
  notificationType!: NotifTypeDomain
  firstName: string = ''
  lastName: string = ''
  contactValue: string = ''
}
