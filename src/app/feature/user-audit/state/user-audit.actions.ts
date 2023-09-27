import { StateContext } from "@ngxs/store"
import { UserAuditStateModel } from "./user-audit.state"

export class UserAuditGet {
  static readonly type = '[UserAudit] FetchUserAudit'
}

export class UserAuditGetQuery {
  static readonly type = '[UserAudit] FetchUserAuditQuery'
  constructor(public data: any) {}
}


export class UserAuditGetAllInformation {
  static readonly type = '[UserAudit] UserAuditGetAllInformation'

  constructor(
    public action: (ctx: StateContext<UserAuditStateModel>) => void,
  ) {}
}