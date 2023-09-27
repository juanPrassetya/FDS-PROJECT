import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  ResetTransParamById,
  TransParamAdd,
  TransParamDelete,
  TransParamGet,
  TransParamGetByEndpoint,
  TransParamGetById,
  TransParamGetCommon,
  TransParamGetQuery,
  TransParamUpdate
} from "./trans-param.actions";
import { TransParamDomain } from "../domain/trans-param.domain";

@Injectable({
  providedIn: 'root'
})
export class TransParamDispatcher {

  @Dispatch()
  public _FetchAllTransParam() {
    return new TransParamGet();
  }

  @Dispatch()
  public _FetchAllTransParamByEndpoint(id: number) {
    return new TransParamGetByEndpoint(id);
  }

  @Dispatch()
  public _ResetTransParamById() {
    return new ResetTransParamById();
  }

  @Dispatch()
  public _FetchAllTransParamById(id: number) {
    return new TransParamGetById(id);
  }

  @Dispatch()
  public _FetchAllTransParamQuery(data: any) {
    return new TransParamGetQuery(data);
  }

  @Dispatch()
  public _FetchAllTransParamCommon() {
    return new TransParamGetCommon();
  }

  @Dispatch()
  public _AddTransParam(payload: TransParamDomain) {
    return new TransParamAdd(payload)
  }

  @Dispatch()
  public _UpdateTransParam(payload: TransParamDomain) {
    return new TransParamUpdate(payload)
  }

  @Dispatch()
  public _DeleteTransParam(id: number) {
    return new TransParamDelete(id)
  }
}
