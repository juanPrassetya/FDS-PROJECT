import {InstitutionDomain} from "../domain/institution.domain";

export class InstitutionGet {
  static readonly type = '[Institution] FetchInstitution'
}

export class InstitutionGetQuery {
  static readonly type = '[Institution] FetchInstitutionQuery'
  constructor(public data: any) {}
}

export class InstitutionAdd {
  static readonly type = '[Institution] InstitutionAdd'
  constructor(
    public data: InstitutionDomain
  ) {
  }
}

export class InstitutionUpdate {
  static readonly type = '[Institution] InstitutionUpdate'

  constructor(
    public currentName: string,
    public data: InstitutionDomain
  ) {
  }
}

export class InstitutionDelete {
  static readonly type = '[Institution] InstitutionDelete'

  constructor(
    public id: number
  ) {
  }
}
