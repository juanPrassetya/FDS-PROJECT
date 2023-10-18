import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  ActionAdd,
  ActionDelete,
  ActionGet,
  ActionGetQuery,
  ActionUpdate,
} from './action.actions';
import { ActionDomain } from '../domain/action.component';

@Injectable({
  providedIn: 'root',
})
export class ActionDispatcher {
  @Dispatch()
  public _ActionGet() {
    return new ActionGet();
  }

  @Dispatch()
  public _ActionGetQuery(data: any) {
    return new ActionGetQuery(data);
  }

  @Dispatch()
  public _ActionAdd(data: ActionDomain) {
    return new ActionAdd(data);
  }

  @Dispatch()
  public _ActionUpdate(currentName: string, data: ActionDomain) {
    return new ActionUpdate(currentName, data);
  }

  @Dispatch()
  public _ActionDelete(id: number) {
    return new ActionDelete(id);
  }
}
