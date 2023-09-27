import { ResponseCodeDomain } from '../domain/response-code.domain';

export class GetResponseCode {
  static readonly type = '[Response Code] Get';
  constructor(public id: number) {}
}

export class GetResponseCodeQuery {
  static readonly type = '[Response Code] Get Query';
  constructor(public data: any) {}
}

export class getResponseCodeById {
  static readonly type = '[Response Code] Get ById'
  constructor(public id: number) {}
}

export class AddResponseCode {
  static readonly type = '[Response Code] Add';
  constructor(public payload: ResponseCodeDomain) {}
}

export class DeleteResponseCode {
  static readonly type = '[Response Code] Delete';
  constructor(public id: number) {}
}

export class UpdateResponseCode {
  static readonly type = '[Response Code] Update';
  constructor(public payload: ResponseCodeDomain) {}
}
