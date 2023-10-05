import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  RescodeAdd,
  RescodeDelete,
  RescodeGet,
  RescodeGetQuery,
  RescodeUpdate,
} from './rescode.actions';
import { RescodeDomain } from '../domain/rescode.domain';

@Injectable({
  providedIn: 'root',
})
export class RescodeDispatcher {
  @Dispatch()
  public _RescodeGet() {
    return new RescodeGet();
  }

  @Dispatch()
  public _RescodeGetQuery(data: any) {
    return new RescodeGetQuery(data);
  }

  @Dispatch()
  public _RescodeAdd(data: RescodeDomain) {
    return new RescodeAdd(data);
  }

  @Dispatch()
  public _RescodeUpdate(currentName: string, data: RescodeDomain) {
    return new RescodeUpdate(currentName, data);
  }

  @Dispatch()
  public _RescodeDelete(id: number) {
    return new RescodeDelete(id);
  }
}
