import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseCodeDomain } from '../domain/response-code.domain';
import { ResponseCodeDispatcher } from '../state/response-code.dispatcher';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomHttpResponse } from 'src/app/shared/domain/customHttpResponse';
import { RoutePathEnum } from 'src/app/shared/enum/route-path.enum';
import { IntResponseCodeDomain } from '../domain/int-response-code.domain';

@Injectable({
  providedIn: 'root',
})
export class ResponseCodeService {
  apiUrl = environment.dev_env;
  loading: boolean = true;
  constructor(
    private http: HttpClient,
    private resposneCodeDispatch: ResponseCodeDispatcher
  ) {}

  getAllResponseCode(id: number) {
    return this.http.get<CustomHttpResponse<ResponseCodeDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.RESP_CODE_MAPPING_GET_PATH}/${id}`
    );
  }

  getAllResponseCodeQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(
      `${this.apiUrl}/${RoutePathEnum.RESP_CODE_MAPPING_GET_QUERY_PATH}`
    , data);
  }

  getResponseCodeById(id: number) {
    const params = new HttpParams().set('configId', id);

    return this.http.get<CustomHttpResponse<ResponseCodeDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.RESP_CODE_GET_BY_ID_PATH}`,
      { params }
    );
  }

  getIntRespCode() {
    return this.http.get<CustomHttpResponse<IntResponseCodeDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.INT_RESP_CODE_GET__PATH}`
    );
  }

  addResponseCode(payload: ResponseCodeDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.RESP_CODE_MAPPING_ADD_PATH}`,
      payload
    );
  }

  deleteResponseCode(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.RESP_CODE_MAPPING_DELETE_PATH}/` + id
    );
  }

  updateResponseCode(payload: ResponseCodeDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.RESP_CODE_MAPPING_UPDATE_PATH}`,
      payload
    );
  }

  onGetAllResponseCode(id: number) {
    this.resposneCodeDispatch._GetResponseCodeDispatch(id);
  }

  onGetAllResponseCodeQuery(data: any) {
    this.resposneCodeDispatch._GetQueryResponseCodeDispatch(data)
  }

  onGetResponseCodeById(id: number) {
    this.resposneCodeDispatch._GetResponseCodeByIdDispatch(id)
  }

  onAddResponseCode(payload: ResponseCodeDomain) {
    this.resposneCodeDispatch._AddResponseCodeDispatch(payload);
  }

  onDeleteResponseCode(id: number) {
    this.resposneCodeDispatch._DeleteResponseCodeDispatch(id);
  }

  onUpdateResponseCode(payload: ResponseCodeDomain) {
    this.resposneCodeDispatch._UpdateResponseCodeDispatch(payload);
  }
}
