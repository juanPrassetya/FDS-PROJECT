import {MessageTypeDomain} from "./message-type.domain";

export class MessageConfigurationDomain {
  configId!: bigint
  name: string = ''
  description: string = ''
  hasHeader: boolean = false
  msgType!: MessageTypeDomain
}
