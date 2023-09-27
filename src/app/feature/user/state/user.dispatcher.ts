import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  UserAdd,
  UserDelete,
  UserGet,
  UserGetAllInformation,
  UserGetForward,
  UserGetQuery,
  UserResetPassword,
  UserUpdate
} from './user.actions';
import { UserDomain } from '../domain/user.domain';
import {StateContext} from "@ngxs/store";
import {UserStateModel} from "./user.state";

@Injectable({
  providedIn: 'root',
})
export class UserDispatcher {
  @Dispatch()
  public _UserGet() {
    return new UserGet();
  }

  @Dispatch()
  public _UserGetQuery(data: any) {
    return new UserGetQuery(data);
  }

  @Dispatch()
  public _UserGetForward(username: string) {
    return new UserGetForward(username);
  }

  @Dispatch()
  public _UserDelete(id: number) {
    return new UserDelete(id);
  }

  @Dispatch()
  public _UserUpdate(currentName: string, payload: UserDomain) {
    return new UserUpdate(currentName, payload);
  }

  @Dispatch()
  public _UserAdd(payload: UserDomain) {
    return new UserAdd(payload);
  }

  @Dispatch()
  public _UserResetPassword(username: string, data: any) {
    return new UserResetPassword(username, data);
  }

  @Dispatch()
  public _UserGetAllInformation(action: (ctx: StateContext<UserStateModel>) => void) {
    return new UserGetAllInformation(action);
  }
}
