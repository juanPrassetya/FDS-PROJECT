import {ConnectsetDomain} from "../domain/connectset.domain";

export class ConnectsetGet {
  static readonly type = '[Connectset] FetchConnectset'
}

export class ConnectsetGetQuery {
  static readonly type = '[Connectset] FetchConnectsetQuery'
  constructor(public data: any) {}
}

export class ConnectsetAdd {
  static readonly type = '[Connectset] ConnectsetAdd'
  constructor(
    public data: ConnectsetDomain
  ) {
  }
}

export class ConnectsetUpdate {
  static readonly type = '[Connectset] ConnectsetUpdate'

  constructor(
    public currentName: string,
    public data: ConnectsetDomain
  ) {
  }
}

export class ConnectsetDelete {
  static readonly type = '[Connectset] ConnectsetDelete'

  constructor(
    public id: number
  ) {
  }
}
