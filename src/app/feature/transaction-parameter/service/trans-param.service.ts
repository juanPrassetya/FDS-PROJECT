import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomHttpResponse } from '../../../shared/domain/customHttpResponse';
import { TransParamDomain } from '../domain/trans-param.domain';
import { TransParamDispatcher } from '../state/trans-param.dispatcher';
import { RoutePathEnum } from '../../../shared/enum/route-path.enum';

@Injectable({
  providedIn: 'root',
})
export class TransParamService {
  private apiUrl = environment.dev_env;

  constructor(
    private http: HttpClient,
    private transParamDispatcher: TransParamDispatcher
  ) {}

  fetchAllTransParam() {
    return this.http.get<CustomHttpResponse<Array<TransParamDomain>>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_GET_PATH}`
    );
  }

  fetchAllTransParamById(id: number) {
    return this.http.get<CustomHttpResponse<Array<TransParamDomain>>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_GET_PATH}/${id}`
    );
  }

  fetchAllTransParamByEndpoint(id: number) {
    return this.http.get<CustomHttpResponse<Array<TransParamDomain>>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_GET_BY_ENDPOINT_PATH}/${id}`
    );
  }

  fetchAllTransParamQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_GET_QUERY_PATH}`,
      data
    );
  }

  fetchAllTransParamCommon() {
    return this.http.get<CustomHttpResponse<Array<TransParamDomain>>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_GET_COMMON_PATH}`
    );
  }

  addTransParam(payload: TransParamDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_ADD_PATH}`,
      payload
    );
  }

  updateTransParam(payload: TransParamDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_UPDATE_PATH}`,
      payload
    );
  }

  deleteTransParam(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.TRANS_PARAM_DELETE_PATH}/` + id
    );
  }

  onFetchAllTransParam() {
    this.transParamDispatcher._FetchAllTransParam();
  }

  onFetchTransParamByEndpoint(id: number) {
    this.transParamDispatcher._FetchAllTransParamByEndpoint(id)
  }

  onFetchAllTransParamById(id: number) {
    this.transParamDispatcher._FetchAllTransParamById(id);
  }

  onFetchTransParamQuery(data: any) {
    this.transParamDispatcher._FetchAllTransParamQuery(data);
  }

  onFetchAllTransParamCommon() {
    this.transParamDispatcher._FetchAllTransParamCommon();
  }

  onAddTransParam(payload: TransParamDomain) {
    this.transParamDispatcher._AddTransParam(payload);
  }

  onUpdateTransParam(payload: TransParamDomain) {
    this.transParamDispatcher._UpdateTransParam(payload);
  }

  onDeleteTransParam(id: number) {
    this.transParamDispatcher._DeleteTransParam(id);
  }
}
