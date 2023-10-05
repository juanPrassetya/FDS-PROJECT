import {ManagementDomain} from "../domain/management.domain";

export class ManagementGet {
  static readonly type = '[Management] FetchManagement'
}

export class ManagementGetQuery {
  static readonly type = '[Management] FetchManagementQuery'
  constructor(public data: any) {}
}

export class ManagementAdd {
  static readonly type = '[Management] ManagementAdd'
  constructor(
    public data: ManagementDomain
  ) {
  }
}

export class ManagementUpdate {
  static readonly type = '[Management] ManagementUpdate'

  constructor(
    public currentName: string,
    public data: ManagementDomain
  ) {
  }
}

export class ManagementDelete {
  static readonly type = '[Management] ManagementDelete'

  constructor(
    public id: number
  ) {
  }
}
