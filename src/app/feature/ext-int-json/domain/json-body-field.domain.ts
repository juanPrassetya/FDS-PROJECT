import { JsonFieldTypeDomain } from './json-field-type.domain';
import { JsonEndpointDomain } from './json-endpoint.domain';
import { JsonFormatterDomain } from './json-formatter.domain';
import { MessageConfigurationDomain } from '../../ext-int-iso8583/domain/message-configuration.domain';
import { JsonActionTypeDomain } from './json-action-type.domain';

export class JsonEndpointFieldDomain {
  endpointId!: bigint;
  url: string = '';
  isAuth: string = '';
  configId!: MessageConfigurationDomain;
  type: string = '';
  states: Array<JsonStateFieldDomain> = [];
}

export class JsonStateFieldDomain {
  state: string = '';
  configs: Array<JsonBodyFieldDomain> = [];
}

export class JsonBodyFieldDomain {
  id!: bigint;
  fieldName: string = '';
  length: number = 0;
  parentField!: bigint;
  dataType!: JsonFieldTypeDomain;
  endpointId!: JsonEndpointDomain;
  formatter!: JsonFormatterDomain;
  actions!: JsonActionTypeDomain;
  configId!: MessageConfigurationDomain;
  childConfigs: Array<JsonBodyFieldDomain> = [];
}
