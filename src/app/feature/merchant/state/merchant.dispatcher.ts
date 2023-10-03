import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import {
  MerchantAdd,
  MerchantDelete,
  MerchantGet,
  MerchantGetQuery,
  MerchantUpdate,
} from './merchant.actions';
import { MerchantDomain } from '../domain/merchant.domain';

@Injectable({
  providedIn: 'root',
})
export class MerchantDispatcher {
  @Dispatch()
  public _MerchantGet() {
    return new MerchantGet();
  }

  @Dispatch()
  public _MerchantGetQuery(data: any) {
    return new MerchantGetQuery(data);
  }

  @Dispatch()
  public _MerchantAdd(data: MerchantDomain) {
    return new MerchantAdd(data);
  }

  @Dispatch()
  public _MerchantUpdate(currentName: string, data: MerchantDomain) {
    return new MerchantUpdate(currentName, data);
  }

  @Dispatch()
  public _MerchantDelete(id: number) {
    return new MerchantDelete(id);
  }
}
