import {UserGroupDomain} from "../domain/user-group.domain";

export class UserGroupGet {
  static readonly type = '[UserGroup] FetchAllUserGroup'
}

export class UserGroupGetQuery {
  static readonly type = '[UserGroup] FetchAllUserGroupQuery'
  constructor(public data: any) {}
}

export class UserGroupAdd {
  static readonly type = '[UserGroup] UserGroupAdd'
  constructor(
    public data: UserGroupDomain
  ) {
  }
}

export class UserGroupUpdate {
  static readonly type = '[UserGroup] UserGroupUpdate'

  constructor(
    public currentName: string,
    public data: UserGroupDomain
  ) {
  }
}

export class UserGroupDelete {
  static readonly type = '[UserGroup] UserGroupDelete'

  constructor(
    public id: number
  ) {
  }
}
