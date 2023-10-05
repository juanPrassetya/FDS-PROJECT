import {RescodeDomain} from "../domain/rescode.domain";

export class RescodeGet {
  static readonly type = '[Rescode] FetchRescode'
}

export class RescodeGetQuery {
  static readonly type = '[Rescode] FetchRescodeQuery'
  constructor(public data: any) {}
}

export class RescodeAdd {
  static readonly type = '[Rescode] RescodeAdd'
  constructor(
    public data: RescodeDomain
  ) {
  }
}

export class RescodeUpdate {
  static readonly type = '[Rescode] RescodeUpdate'

  constructor(
    public currentName: string,
    public data: RescodeDomain
  ) {
  }
}

export class RescodeDelete {
  static readonly type = '[Rescode] RescodeDelete'

  constructor(
    public id: number
  ) {
  }
}
