import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  InstitutionAdd,
  InstitutionDelete,
  InstitutionGet,
  InstitutionGetQuery,
  InstitutionUpdate,
} from './institution.actions';
import { InstitutionDomain } from '../domain/institution.domain';

@Injectable({
  providedIn: 'root',
})
export class InstitutionDispatcher {
  @Dispatch()
  public _InstitutionGet() {
    return new InstitutionGet();
  }

  @Dispatch()
  public _InstitutionGetQuery(data: any) {
    return new InstitutionGetQuery(data);
  }

  @Dispatch()
  public _InstitutionAdd(data: InstitutionDomain) {
    return new InstitutionAdd(data);
  }

  @Dispatch()
  public _InstitutionUpdate(currentName: string, data: InstitutionDomain) {
    return new InstitutionUpdate(currentName, data);
  }

  @Dispatch()
  public _InstitutionDelete(id: number) {
    return new InstitutionDelete(id);
  }
}
