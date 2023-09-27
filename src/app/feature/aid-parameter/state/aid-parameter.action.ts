import { AidParameterDomain } from '../domain/aid-parameter.domain';

export class AidParameterGet {
  static readonly type = '[Aid Param] Get';
}

export class AidParameterAdd {
  static readonly type = '[Aid Param] Add';
  constructor(public payload: AidParameterDomain) {}
}

export class AidParameterUpdate {
  static readonly type = '[Aid Param] Update';
  constructor(public payload: AidParameterDomain) {}
}

export class AidParameterDelete {
    static readonly type = '[Aid Param] Delete';
    constructor(public id: number) {
        
    }
}
