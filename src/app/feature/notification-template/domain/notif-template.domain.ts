import {NotifTypeDomain} from "../../notification-type/domain/notif-type.domain";

export class NotifTemplateDomain {
  templateId!: bigint
  subjectText: string = ''
  templateText: string = ''
  description: string = ''
  notificationType!: NotifTypeDomain
}
