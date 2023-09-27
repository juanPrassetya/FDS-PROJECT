import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {BlackListDomain} from "../domain/black-list.domain";
import {
  BlackListAdd,
  BlackListDelete,
  BlackListGet,
  BlackListGetAllInformation,
  BlackListGetQuery,
  BlackListUpdate,
  BlackListUpload
} from "./black-list.actions";
import {StateContext} from "@ngxs/store";
import {BlackListStateModel} from "./black-list.state";

@Injectable({
  providedIn: 'root'
})
export class BlackListDispatcher {

  @Dispatch()
  public _BlackListGet() {
    return new BlackListGet()
  }

  @Dispatch()
  public _BlackListGetQuery(data: any) {
    return new BlackListGetQuery(data)
  }

  @Dispatch()
  public _BlackListAdd(data: BlackListDomain) {
    return new BlackListAdd(data)
  }

  @Dispatch()
  public _BlackListUpdate(currentId: number, data: BlackListDomain) {
    return new BlackListUpdate(currentId, data)
  }

  @Dispatch()
  public _BlackListDelete(id: number) {
    return new BlackListDelete(id)
  }

  @Dispatch()
  public _BlackListUpload(data: {file: any, initiatorId: string, uGroupId: string}) {
    return new BlackListUpload(data)
  }

  @Dispatch()
  public _BlackListGetAllInformation(action: (ctx: StateContext<BlackListStateModel>) => void) {
    return new BlackListGetAllInformation(action)
  }
}
