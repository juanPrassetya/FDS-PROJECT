export class TransParamDomain {
  attrId: bigint | undefined;
  attribute: string = '';
  fieldTag: string = '';
  configId: bigint | undefined;
  description: string = '';
  addtData: boolean = true;
  endpointId: bigint | undefined;

  constructor(attrId: bigint | undefined, attribute: string, fieldTag: string, configId: bigint | undefined, description: string, addtData: boolean) {
    this.attrId = attrId;
    this.attribute = attribute;
    this.fieldTag = fieldTag;
    this.configId = configId;
    this.description = description;
    this.addtData = addtData;
  }
}
