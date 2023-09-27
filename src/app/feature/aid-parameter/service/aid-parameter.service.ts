import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomHttpResponse } from 'src/app/shared/domain/customHttpResponse';
import { environment } from 'src/environments/environment';
import { AidParameterDomain } from '../domain/aid-parameter.domain';
import { RoutePathEnum } from 'src/app/shared/enum/route-path.enum';
import { AidParameterDispatcher } from '../state/aid-parameter.dispatcher';

@Injectable({
  providedIn: 'root',
})
export class AidParameterService {
  apiUrl = environment.dev_env;
  constructor(private http: HttpClient, private aidDispatch: AidParameterDispatcher) {}

  getAidParameter() {
    return this.http.get<CustomHttpResponse<AidParameterDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.AID_PARAMETER_GET_PATH}`
    );
  }

  addAidParameter(payload: AidParameterDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.AID_PARAMETER_ADD_PATH}`,
      payload
    );
  }

  updateAidParameter(payload: AidParameterDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.AID_PARAMETER_UPDATE_PATH}`,
      payload
    );
  }

  deleteAidParameter(id: number) {
    return this.http.delete<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.AID_PARAMETER_DELETE_PATH}/` + id
    );
  }

  onGetAidDispatch() {
    this.aidDispatch._AidParameterGet();
  }

  onAddAidDispatch(payload: AidParameterDomain) {
    this.aidDispatch._AidParameterAdd(payload)
  }

  onUpdateAidDispatch(payload: AidParameterDomain) {
    this.aidDispatch._AidParameterUpdate(payload)
  }

  onDeleteAidDispatch(id: number) {
    this.aidDispatch._AidParameterDelete(id)
  }
}
