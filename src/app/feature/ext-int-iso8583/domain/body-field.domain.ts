import {FieldFormatDomain} from "./field-format.domain";
import {FieldEncodingDomain} from "./field-encoding.domain";
import {MessageConfigurationDomain} from "./message-configuration.domain";
import {ChildBodyFieldDomain} from "./child-body-field.domain";

export class BodyFieldDomain {
  id!: bigint
  formatId!: FieldFormatDomain
  fieldId: number = 0
  length: number = 0
  description: string = ''
  hasChild: boolean = false
  priority: number = 1
  encodingId!: FieldEncodingDomain
  configId!: MessageConfigurationDomain
  subFieldConfigurations: ChildBodyFieldDomain[] = []
}
