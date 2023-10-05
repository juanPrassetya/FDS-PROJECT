import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  MappingAdd,
  MappingDelete,
  MappingGet,
  MappingGetQuery,
  MappingUpdate,
} from './mapping.actions';
import { MappingDomain } from '../domain/mapping.domain';

@Injectable({
  providedIn: 'root',
})
export class MappingDispatcher {
  @Dispatch()
  public _MappingGet() {
    return new MappingGet();
  }

  @Dispatch()
  public _MappingGetQuery(data: any) {
    return new MappingGetQuery(data);
  }

  @Dispatch()
  public _MappingAdd(data: MappingDomain) {
    return new MappingAdd(data);
  }

  @Dispatch()
  public _MappingUpdate(currentName: string, data: MappingDomain) {
    return new MappingUpdate(currentName, data);
  }

  @Dispatch()
  public _MappingDelete(id: number) {
    return new MappingDelete(id);
  }
}
