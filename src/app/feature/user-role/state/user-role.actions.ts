import {UserRoleDomain} from "../domain/user-role.domain";

export class UserRoleGet {
  static readonly type = '[UserRole] FetchUserRole'
}

export class UserRoleGetQuery {
  static readonly type = '[UserRole] FetchUserRoleQuery'
  constructor(public data: any) {}
}

export class OperationGet {
  static readonly type = '[UserRole] FetchOperation'
}

export class UserRoleAdd {
  static readonly type = '[UserRole] UserRoleAdd'
  constructor(
    public data: UserRoleDomain
  ) {
  }
}

export class UserRoleUpdate {
  static readonly type = '[UserRole] UserRoleUpdate'

  constructor(
    public currentName: string,
    public data: UserRoleDomain
  ) {
  }
}

export class UserRoleDelete {
  static readonly type = '[UserRole] UserRoleDelete'

  constructor(
    public id: number
  ) {
  }
}
