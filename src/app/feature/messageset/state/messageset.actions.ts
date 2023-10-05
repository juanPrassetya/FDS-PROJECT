import { MessagesetDomain } from "../domain/messageset.component"

export class MessagesetGet {
  static readonly type = '[Messageset] FetchMessageset'
}

export class MessagesetGetQuery {
  static readonly type = '[Messageset] FetchMessagesetQuery'
  constructor(public data: any) {}
}

export class MessagesetAdd {
  static readonly type = '[Messageset] MessagesetAdd'
  constructor(
    public data: MessagesetDomain
  ) {
  }
}

export class MessagesetUpdate {
  static readonly type = '[Messageset] MessagesetUpdate'

  constructor(
    public currentName: string,
    public data: MessagesetDomain
  ) {
  }
}

export class MessagesetDelete {
  static readonly type = '[Messageset] MessagesetDelete'

  constructor(
    public id: number
  ) {
  }
}
