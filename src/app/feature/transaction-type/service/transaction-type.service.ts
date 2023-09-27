import { Injectable } from '@angular/core';
import { TransactionTypeDomain } from '../domain/transaction-type.domain';
import { CustomHttpResponse } from 'src/app/shared/domain/customHttpResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TransactionTypeDispatcher } from '../state/transaction-type.dispatcher';
import { RoutePathEnum } from 'src/app/shared/enum/route-path.enum';
import { IntTransactionTypeDomain } from '../domain/int-transaction-type.domain';

@Injectable({
  providedIn: 'root',
})
export class TransactionTypeService {
  apiUrl = environment.dev_env;
  constructor(
    private http: HttpClient,
    private transactionTypeDispatch: TransactionTypeDispatcher
  ) {}

  getAllTransactionType(id: number) {
    return this.http.get<CustomHttpResponse<TransactionTypeDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_TYPE_MAPPING_GET_PATH}/${id}`
    );
  }

  getIntTransactionType() {
    return this.http.get<CustomHttpResponse<IntTransactionTypeDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.INT_TRANS_TYPE_GET__PATH}`
    );
  }

  getAllTransactionTypeQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_TYPE_MAPPING_GET_QUERY_PATH}`,
      data
    );
  }

  addTransactionType(payload: TransactionTypeDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_TYPE_MAPPING_ADD_PATH}`,
      payload
    );
  }

  deleteTransactionType(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_TYPE_MAPPING_DELETE_PATH}/` + id
    );
  }

  updateTransactionType(payload: TransactionTypeDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_TYPE_MAPPING_UPDATE_PATH}`,
      payload
    );
  }

  onGetAllTransactionType(id: number) {
    this.transactionTypeDispatch._TransactionTypeGetDispatch(id);
  }

  onGetAllTransactionTypeQuery(data: any) {
    this.transactionTypeDispatch._TransactionTypeGetQueryDispatch(data)
  }

  onAddTransactionType(payload: TransactionTypeDomain) {
    this.transactionTypeDispatch._TransactionTypeAddDispatch(payload);
  }

  onDeleteTransactionType(id: number) {
    this.transactionTypeDispatch._TransactionTypeDeleteDispatch(id);
  }

  onUpdateTransactionType(payload: TransactionTypeDomain) {
    this.transactionTypeDispatch._TransactionTypeUpdateDispatch(payload);
  }
}
