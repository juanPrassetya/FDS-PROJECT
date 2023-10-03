import { KeysDomain } from "../domain/keys.component"

export class KeysGet {
  static readonly type = '[Keys] FetchKeys'
}

export class KeysGetQuery {
  static readonly type = '[Keys] FetchKeysQuery'
  constructor(public data: any) {}
}

export class KeysAdd {
  static readonly type = '[Keys] KeysAdd'
  constructor(
    public data: KeysDomain
  ) {
  }
}

export class KeysUpdate {
  static readonly type = '[Keys] KeysUpdate'

  constructor(
    public currentName: string,
    public data: KeysDomain
  ) {
  }
}

export class KeysDelete {
  static readonly type = '[Keys] KeysDelete'

  constructor(
    public id: number
  ) {
  }
}
