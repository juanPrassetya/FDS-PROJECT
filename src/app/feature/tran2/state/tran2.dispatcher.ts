import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  Tran2Add,
  Tran2Delete,
  Tran2Get,
  Tran2GetQuery,
  Tran2Update,
} from './tran2.actions';
import { Tran2Domain } from '../domain/tran2.component';

@Injectable({
  providedIn: 'root',
})
export class Tran2Dispatcher {
  @Dispatch()
  public _Tran2Get() {
    return new Tran2Get();
  }

  @Dispatch()
  public _Tran2GetQuery(data: any) {
    return new Tran2GetQuery(data);
  }

  @Dispatch()
  public _Tran2Add(data: Tran2Domain) {
    return new Tran2Add(data);
  }

  @Dispatch()
  public _Tran2Update(currentName: string, data: Tran2Domain) {
    return new Tran2Update(currentName, data);
  }

  @Dispatch()
  public _Tran2Delete(id: number) {
    return new Tran2Delete(id);
  }
}
