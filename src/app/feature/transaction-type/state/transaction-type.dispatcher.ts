import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TransactionTypeGet, TransactionTypeAdd, TransactionTypeDelete, TransactionTypeUpdate, TransactionTypeGetQuery } from './transaction-type.action';
import { TransactionTypeDomain } from '../domain/transaction-type.domain';

@Injectable({
  providedIn: 'root',
})
export class TransactionTypeDispatcher {
  @Dispatch()
  public _TransactionTypeGetDispatch(id: number) {
    return new TransactionTypeGet(id);
  }

  @Dispatch()
  public _TransactionTypeGetQueryDispatch(data: any) {
    return new TransactionTypeGetQuery(data);
  }
  @Dispatch()
  public _TransactionTypeAddDispatch(payload: TransactionTypeDomain) {
    return new TransactionTypeAdd(payload);
  }
  @Dispatch()
  public _TransactionTypeDeleteDispatch(id: number) {
    return new TransactionTypeDelete(id);
  }
  @Dispatch()
  public _TransactionTypeUpdateDispatch(payload: TransactionTypeDomain) {
    return new TransactionTypeUpdate(payload);
  }
}
