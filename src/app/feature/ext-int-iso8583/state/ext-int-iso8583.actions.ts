import {MessageConfigurationDomain} from '../domain/message-configuration.domain';
import {HeaderFieldDomain} from '../domain/header-field.domain';
import {BodyFieldDomain} from '../domain/body-field.domain';
import {ChildBodyFieldDomain} from '../domain/child-body-field.domain';
import {StateContext} from '@ngxs/store';
import {ExtIntIso8583StateModel} from './ext-int-iso8583.state';

//Message Configuration
export class MessageConfigurationGet {
  static readonly type = '[ExtIntISO8583] FetchMessageConfiguration';
}

export class MessageConfigurationGetQuery {
  static readonly type = '[ExtIntISO8583] FetchMessageConfigurationQuery';
  constructor(public data: any) {}
}

export class MessageConfigurationGetById {
  static readonly type = '[ExtIntISO8583] FetchMessageConfigurationById';

  constructor(public id: number) {}
}

export class MessageConfigurationAdd {
  static readonly type = '[ExtIntISO8583] MessageConfigurationAdd';

  constructor(public data: MessageConfigurationDomain) {}
}

export class MessageConfigurationUpdate {
  static readonly type = '[ExtIntISO8583] MessageConfigurationUpdate';

  constructor(public data: MessageConfigurationDomain) {}
}

export class MessageConfigurationDelete {
  static readonly type = '[ExtIntISO8583] MessageConfigurationDelete';

  constructor(public id: number) {}
}

//Header Field
export class HeaderFieldGet {
  static readonly type = '[ExtIntISO8583] FetchHeaderField';

  constructor(public id: number) {}
}

export class HeaderFieldGetQuery {
  static readonly type = '[ExtIntISO8583] FetchHeaderField Query';
  constructor(public data: any) {}
}

export class HeaderFieldAdd {
  static readonly type = '[ExtIntISO8583] HeaderFieldAdd';

  constructor(public data: HeaderFieldDomain) {}
}

export class HeaderFieldUpdate {
  static readonly type = '[ExtIntISO8583] HeaderFieldUpdate';

  constructor(public data: HeaderFieldDomain) {}
}

export class HeaderFieldDelete {
  static readonly type = '[ExtIntISO8583] HeaderFieldDelete';

  constructor(public id: number) {}
}

//Body Field
export class BodyFieldGet {
  static readonly type = '[ExtIntISO8583] FetchBodyField';

  constructor(public id: number) {}
}

export class BodyFieldGetQuery {
  static readonly type = '[ExtIntISO8583] FetchBodyFieldQuery';
  constructor(public data: any) {}
}

export class BodyFieldAdd {
  static readonly type = '[ExtIntISO8583] BodyFieldAdd';

  constructor(public data: BodyFieldDomain) {}
}

export class BodyFieldUpdate {
  static readonly type = '[ExtIntISO8583] BodyFieldUpdate';

  constructor(public data: BodyFieldDomain) {}
}

export class BodyFieldDelete {
  static readonly type = '[ExtIntISO8583] BodyFieldDelete';

  constructor(public id: number) {}
}

//Child Body Field
export class ChildBodyFieldGet {
  static readonly type = '[ExtIntISO8583] FetchChildBodyField';

  constructor(public id: number) {}
}

export class ChildBodyFieldAdd {
  static readonly type = '[ExtIntISO8583] ChildBodyFieldAdd';

  constructor(public data: ChildBodyFieldDomain) {}
}

export class ChildBodyFieldUpdate {
  static readonly type = '[ExtIntISO8583] ChildBodyFieldUpdate';

  constructor(public data: ChildBodyFieldDomain) {}
}

export class ChildBodyFieldDelete {
  static readonly type = '[ExtIntISO8583] ChildBodyFieldDelete';

  constructor(public id: number) {}
}

export class GetBodyChildField {
  static readonly type = '[ExtIntISO8583] GetBodyChildField';

  constructor(public configId: number, public bodyId: number) {}
}

// RespCode

export class getIntRespCode {
  static readonly type = '[ExtIntISO8583] Get IntRespCode';
}

// Transaction Type
export class getIntTransactionType {
  static readonly type = '[ExtIntISO8583] Get IntTransactionType';
}

export class GetAllInformation {
  static readonly type = '[ExtIntISO8583] GetAllInformation';

  constructor(
    public action: (ctx: StateContext<ExtIntIso8583StateModel>) => void
  ) {}
}

export class ExtISO8583ResetAllInformation {
  static readonly type = '[ExtIntISO8583] ResetAllInformation';

  constructor(
    public action: (ctx: StateContext<ExtIntIso8583StateModel>) => void
  ) {}
}
