import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  MessagesetAdd,
  MessagesetDelete,
  MessagesetGet,
  MessagesetGetQuery,
  MessagesetUpdate,
} from './messageset.actions';
import { MessagesetDomain } from '../domain/messageset.component';

@Injectable({
  providedIn: 'root',
})
export class MessagesetDispatcher {
  @Dispatch()
  public _MessagesetGet() {
    return new MessagesetGet();
  }

  @Dispatch()
  public _MessagesetGetQuery(data: any) {
    return new MessagesetGetQuery(data);
  }

  @Dispatch()
  public _MessagesetAdd(data: MessagesetDomain) {
    return new MessagesetAdd(data);
  }

  @Dispatch()
  public _MessagesetUpdate(currentName: string, data: MessagesetDomain) {
    return new MessagesetUpdate(currentName, data);
  }

  @Dispatch()
  public _MessagesetDelete(id: number) {
    return new MessagesetDelete(id);
  }
}
