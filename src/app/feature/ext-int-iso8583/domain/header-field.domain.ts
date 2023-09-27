import {FieldFormatDomain} from "./field-format.domain";
import {FieldEncodingDomain} from "./field-encoding.domain";
import {MessageConfigurationDomain} from "./message-configuration.domain";

export class HeaderFieldDomain {
  id!: bigint
  fieldId: number = 0
  length: number = 0
  description: string = ''
  priority: number = 0
  formatId!: FieldFormatDomain
  encodingId!: FieldEncodingDomain
  configId!: MessageConfigurationDomain
}
