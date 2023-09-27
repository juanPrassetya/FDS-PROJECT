import {NotifTypeDomain} from "../../notification-type/domain/notif-type.domain";
import {RecipientSetupDomain} from "../../recipient-setup/domain/recipient-setup.domain";

export class RecipientGroupDomain {
  groupId!: bigint
  notificationType!: NotifTypeDomain
  groupName: string = ''
  recipientSetups: Array<RecipientSetupDomain> = []
}
