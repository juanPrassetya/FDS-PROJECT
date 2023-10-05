import {MappingDomain} from "../domain/mapping.domain";

export class MappingGet {
  static readonly type = '[Mapping] FetchMapping'
}

export class MappingGetQuery {
  static readonly type = '[Mapping] FetchMappingQuery'
  constructor(public data: any) {}
}

export class MappingAdd {
  static readonly type = '[Mapping] MappingAdd'
  constructor(
    public data: MappingDomain
  ) {
  }
}

export class MappingUpdate {
  static readonly type = '[Mapping] MappingUpdate'

  constructor(
    public currentName: string,
    public data: MappingDomain
  ) {
  }
}

export class MappingDelete {
  static readonly type = '[Mapping] MappingDelete'

  constructor(
    public id: number
  ) {
  }
}
