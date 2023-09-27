import { MessageConfigurationDomain } from "../../ext-int-iso8583/domain/message-configuration.domain";
import { JsonEndpointDomain } from "./json-endpoint.domain";
import { JsonFieldTypeDomain } from "./json-field-type.domain";
import { JsonFormatterDomain } from "./json-formatter.domain";

export class JsonHeaderFieldDomain {
    endpointId!: bigint;
    url: string = ''
    isAuth: string = '';
    configId!: MessageConfigurationDomain;
    type: string = '';
    states: Array<JsonStateFieldDomain> = []
}

export class JsonStateFieldDomain {
  state: string = ''
  configs: Array<JsonConfigsHeaderDomain> = []
}

export class JsonConfigsHeaderDomain {
    id!: number;
    fieldName: string = '';
    length: string = '';
    padChar: string = '';
    letters: string = '';
    sequence: number = 0;
    state: string = '';
    dataType!: JsonFieldTypeDomain;
    formatter!: JsonFormatterDomain;
    endpoint!: JsonEndpointDomain;
    msgConfig!: MessageConfigurationDomain
    level: string = '';
    childField: [] = [];
}