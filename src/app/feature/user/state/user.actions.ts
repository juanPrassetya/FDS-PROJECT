import {UserDomain} from "../domain/user.domain";
import {StateContext} from "@ngxs/store";
import {UserStateModel} from "./user.state";

export class UserGet {
  static readonly type = '[User] FetchUser'
}

export class UserGetQuery {
  static readonly type = '[User] FetchUserQuery'
  constructor(public data: any) {}
}

export class UserGetForward {
  static readonly type = '[User] FetchUserForward'

  constructor(public username: string) {}
}

export class UserAdd {
  static readonly type = '[User] Add';
  constructor(public payload: UserDomain) {}
}

export class UserUpdate {
  static readonly type = '[User] Update';
  constructor(public currentName: string, public payload: UserDomain) {}
}

export class UserDelete {
  static readonly type = '[User] Delete';
  constructor(public id: number) {}
}

export class UserResetPassword {
  static readonly type = '[User] ResetPassword';
  constructor(public username: string, public data: any) {}
}

export class UserGetAllInformation {
  static readonly type = '[User] GetAllInformation';

  constructor(
    public action: (ctx: StateContext<UserStateModel>) => void,
  ) {
  }
}
