import {FieldFormatDomain} from "./field-format.domain";
import {FieldEncodingDomain} from "./field-encoding.domain";

export class ChildBodyFieldDomain {
  id!: bigint
  fieldId: number = 0
  formatId!: FieldFormatDomain
  length: number = 0
  description: string = ''
  isTlvFormat: boolean = false
  priority: number = 1
  encodingId!: FieldEncodingDomain
}
