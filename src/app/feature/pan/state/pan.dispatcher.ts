import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  PanAdd,
  PanDelete,
  PanGet,
  PanGetQuery,
  PanUpdate,
} from './pan.actions';
import { PanDomain } from '../domain/pan.component';

@Injectable({
  providedIn: 'root',
})
export class PanDispatcher {
  @Dispatch()
  public _PanGet() {
    return new PanGet();
  }

  @Dispatch()
  public _PanGetQuery(data: any) {
    return new PanGetQuery(data);
  }

  @Dispatch()
  public _PanAdd(data: PanDomain) {
    return new PanAdd(data);
  }

  @Dispatch()
  public _PanUpdate(currentName: string, data: PanDomain) {
    return new PanUpdate(currentName, data);
  }

  @Dispatch()
  public _PanDelete(id: number) {
    return new PanDelete(id);
  }
}
