import { ActionDomain } from "../domain/action.component"

export class ActionGet {
  static readonly type = '[Action] FetchAction'
}

export class ActionGetQuery {
  static readonly type = '[Action] FetchActionQuery'
  constructor(public data: any) {}
}

export class ActionAdd {
  static readonly type = '[Action] ActionAdd'
  constructor(
    public data: ActionDomain
  ) {
  }
}

export class ActionUpdate {
  static readonly type = '[Action] ActionUpdate'

  constructor(
    public currentName: string,
    public data: ActionDomain
  ) {
  }
}

export class ActionDelete {
  static readonly type = '[Action] ActionDelete'

  constructor(
    public id: number
  ) {
  }
}
