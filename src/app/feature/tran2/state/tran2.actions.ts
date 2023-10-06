import { Tran2Domain } from "../domain/tran2.component"

export class Tran2Get {
  static readonly type = '[Tran2] FetchTran2'
}

export class Tran2GetQuery {
  static readonly type = '[Tran2] FetchTran2Query'
  constructor(public data: any) {}
}

export class Tran2Add {
  static readonly type = '[Tran2] Tran2Add'
  constructor(
    public data: Tran2Domain
  ) {
  }
}

export class Tran2Update {
  static readonly type = '[Tran2] Tran2Update'

  constructor(
    public currentName: string,
    public data: Tran2Domain
  ) {
  }
}

export class Tran2Delete {
  static readonly type = '[Tran2] Tran2Delete'

  constructor(
    public id: number
  ) {
  }
}
