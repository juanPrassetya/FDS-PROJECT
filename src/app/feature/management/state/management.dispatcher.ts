import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  ManagementAdd,
  ManagementDelete,
  ManagementGet,
  ManagementGetQuery,
  ManagementUpdate,
} from './management.actions';
import { ManagementDomain } from '../domain/management.domain';

@Injectable({
  providedIn: 'root',
})
export class ManagementDispatcher {
  @Dispatch()
  public _ManagementGet() {
    return new ManagementGet();
  }

  @Dispatch()
  public _ManagementGetQuery(data: any) {
    return new ManagementGetQuery(data);
  }

  @Dispatch()
  public _ManagementAdd(data: ManagementDomain) {
    return new ManagementAdd(data);
  }

  @Dispatch()
  public _ManagementUpdate(currentName: string, data: ManagementDomain) {
    return new ManagementUpdate(currentName, data);
  }

  @Dispatch()
  public _ManagementDelete(id: number) {
    return new ManagementDelete(id);
  }
}
