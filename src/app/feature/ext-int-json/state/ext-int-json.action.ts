//Message Configuration
import { MessageConfigurationDomain } from '../../ext-int-iso8583/domain/message-configuration.domain';
import { StateContext } from '@ngxs/store';
import { ExtIntIso8583StateModel } from '../../ext-int-iso8583/state/ext-int-iso8583.state';
import { ExtIntJsonStateModel } from './ext-int-json.state';
import { JsonConfigsHeaderDomain } from '../domain/json-header-field.domain';
import { JsonBodyFieldDomain } from '../domain/json-body-field.domain';
import { JsonEndpointDomain } from '../domain/json-endpoint.domain';

export class JSONMessageConfigurationGet {
  static readonly type = '[ExtIntJSON] FetchMessageConfiguration';
}

export class JSONMessageConfigurationGetQuery {
  static readonly type = '[ExtIntJSON] FetchMessageConfigurationQuery';
  constructor(public data: any) {}
}

export class JSONMessageConfigurationGetById {
  static readonly type = '[ExtIntJSON] FetchMessageConfigurationById';

  constructor(public id: number) {}
}

export class JSONMessageConfigurationAdd {
  static readonly type = '[ExtIntJSON] MessageConfigurationAdd';

  constructor(public data: MessageConfigurationDomain) {}
}

export class JSONMessageConfigurationUpdate {
  static readonly type = '[ExtIntJSON] MessageConfigurationUpdate';

  constructor(public data: MessageConfigurationDomain) {}
}

export class JSONMessageConfigurationDelete {
  static readonly type = '[ExtIntJSON] MessageConfigurationDelete';

  constructor(public id: number) {}
}

export class JSONGetAllInformation {
  static readonly type = '[ExtIntJSON] GetAllInformation';

  constructor(
    public action: (ctx: StateContext<ExtIntJsonStateModel>) => void
  ) {}
}

// Header Field
export class JSONHeaderFieldGet {
  static readonly type = '[ExtIntJSON] HeaderGet';
  constructor(public id: number) {}
}

export class JSONHeaderConfigsAddField {
  static readonly type = '[ExtIntJSON] HeaderConfigAdd';
  constructor(public data: JsonConfigsHeaderDomain) {}
}

export class JSONHeaderConfigsUpdateField {
  static readonly type = '[ExtIntJSON] Update Header Config';
  constructor(public data: JsonConfigsHeaderDomain) {}
}

export class JSONHeaderConfigDeleteField {
  static readonly type = '[ExtIntJSON] DeleteHeaderConfig';
  constructor(public id: number) {}
}

// Body Field

export class JSONBodyFieldGet {
  static readonly type = '[ExtIntJSON] BodyGet';
  constructor(public id: number) {}
}

export class JSONBodyConfigsAddField {
  static readonly type = '[ExtIntJSON] BodyConfigAdd';
  constructor(public data: JsonBodyFieldDomain) {}
}

export class JSONBodyConfigsUpdateField {
  static readonly type = '[ExtIntJSON] BodyConfigUpdate';
  constructor(public data: JsonBodyFieldDomain) {}
}

export class JSONBodyConfigsDeleteField {
  static readonly type = '[ExtIntJSON] BodyConfigDelete';
  constructor(public id: number) {}
}

export class JSONFormatterGet {
  static readonly type = '[ExtIntJSON] FormatterGet';
}

export class JSONDataType {
  static readonly type = '[ExtIntJSON] DataTypeGet';
}

export class JSONActionType {
  static readonly type = '[ExtIntJSON] ActionTypeGet';
}

// RespCode

export class getIntRespCode {
  static readonly type = '[ExtIntJSON] Get IntRespCode';
}

// Transaction Type
export class getIntTransactionType {
  static readonly type = '[ExtIntJSON] Get IntTransactionType';
}

// Endpoint
export class JSONEndpointGet {
  static readonly type = '[ExtIntJSON] EndpointGet';
  constructor(public id: number) {}
}

export class JSONEndpointGetById {
  static readonly type = '[ExtIntJSON] EndpointGetById';
  constructor(public id: number) {}
}

export class JSONEndpointAdd {
  static readonly type = '[ExtIntJSON] EndpointAdd';
  constructor(public data: JsonEndpointDomain) {}
}

export class JSONEndpointUpdate {
  static readonly type = '[ExtIntJSON] EndpointUpdate';
  constructor(public data: JsonEndpointDomain) {}
}

export class JSONEndpointDelete {
  static readonly type = '[ExtIntJSON] EndpointDelete';
  constructor(public id: number) {}
}

export class JSONResetAllInformation {
  static readonly type = '[ExtIntJSON] ResetAllInformation';

  constructor(
    public action: (ctx: StateContext<ExtIntJsonStateModel>) => void
  ) {}
}
