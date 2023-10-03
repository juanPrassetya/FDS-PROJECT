import { PanDomain } from "../domain/pan.component"

export class PanGet {
  static readonly type = '[Pan] FetchPan'
}

export class PanGetQuery {
  static readonly type = '[Pan] FetchPanQuery'
  constructor(public data: any) {}
}

export class PanAdd {
  static readonly type = '[Pan] PanAdd'
  constructor(
    public data: PanDomain
  ) {
  }
}

export class PanUpdate {
  static readonly type = '[Pan] PanUpdate'

  constructor(
    public currentName: string,
    public data: PanDomain
  ) {
  }
}

export class PanDelete {
  static readonly type = '[Pan] PanDelete'

  constructor(
    public id: number
  ) {
  }
}
