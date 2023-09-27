import { Injectable } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { GetResponseCode, AddResponseCode, DeleteResponseCode, UpdateResponseCode, getResponseCodeById, GetResponseCodeQuery } from './response-code.action';
import { ResponseCodeDomain } from '../domain/response-code.domain';

@Injectable({
  providedIn: 'root',
})
export class ResponseCodeDispatcher {

  @Dispatch()
  public _GetResponseCodeDispatch(id: number) {
    return new GetResponseCode(id);
  }

  @Dispatch()
  public _GetQueryResponseCodeDispatch(data: any) {
    return new GetResponseCodeQuery(data);
  }

  @Dispatch()
  public _GetResponseCodeByIdDispatch(id: number) {
    return new getResponseCodeById(id);
  }

  @Dispatch()
  public _AddResponseCodeDispatch(payload: ResponseCodeDomain) {
    return new AddResponseCode(payload);
  }
  @Dispatch()
  public _DeleteResponseCodeDispatch(id: number) {
    return new DeleteResponseCode(id);
  }
  @Dispatch()
  public _UpdateResponseCodeDispatch(payload: ResponseCodeDomain) {
    return new UpdateResponseCode(payload);
  }
}
