import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  KeysAdd,
  KeysDelete,
  KeysGet,
  KeysGetQuery,
  KeysUpdate,
} from './keys.actions';
import { KeysDomain } from '../domain/keys.component';

@Injectable({
  providedIn: 'root',
})
export class KeysDispatcher {
  @Dispatch()
  public _KeysGet() {
    return new KeysGet();
  }

  @Dispatch()
  public _KeysGetQuery(data: any) {
    return new KeysGetQuery(data);
  }

  @Dispatch()
  public _KeysAdd(data: KeysDomain) {
    return new KeysAdd(data);
  }

  @Dispatch()
  public _KeysUpdate(currentName: string, data: KeysDomain) {
    return new KeysUpdate(currentName, data);
  }

  @Dispatch()
  public _KeysDelete(id: number) {
    return new KeysDelete(id);
  }
}
