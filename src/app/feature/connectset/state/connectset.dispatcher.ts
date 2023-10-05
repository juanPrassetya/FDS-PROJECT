import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  ConnectsetAdd,
  ConnectsetDelete,
  ConnectsetGet,
  ConnectsetGetQuery,
  ConnectsetUpdate,
} from './connectset.actions';
import { ConnectsetDomain } from '../domain/connectset.domain';

@Injectable({
  providedIn: 'root',
})
export class ConnectsetDispatcher {
  @Dispatch()
  public _ConnectsetGet() {
    return new ConnectsetGet();
  }

  @Dispatch()
  public _ConnectsetGetQuery(data: any) {
    return new ConnectsetGetQuery(data);
  }

  @Dispatch()
  public _ConnectsetAdd(data: ConnectsetDomain) {
    return new ConnectsetAdd(data);
  }

  @Dispatch()
  public _ConnectsetUpdate(currentName: string, data: ConnectsetDomain) {
    return new ConnectsetUpdate(currentName, data);
  }

  @Dispatch()
  public _ConnectsetDelete(id: number) {
    return new ConnectsetDelete(id);
  }
}
