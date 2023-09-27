import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  AidParameterAdd,
  AidParameterDelete,
  AidParameterGet,
  AidParameterUpdate,
} from './aid-parameter.action';
import { AidParameterDomain } from '../domain/aid-parameter.domain';

@Injectable({
  providedIn: 'root',
})
export class AidParameterDispatcher {
  @Dispatch()
  public _AidParameterGet() {
    return new AidParameterGet();
  }

  @Dispatch()
  public _AidParameterAdd(payload: AidParameterDomain) {
    return new AidParameterAdd(payload);
  }

  @Dispatch()
  public _AidParameterUpdate(payload: AidParameterDomain) {
    return new AidParameterUpdate(payload);
  }

  @Dispatch()
  public _AidParameterDelete(id: number) {
    return new AidParameterDelete(id)
  }
}
