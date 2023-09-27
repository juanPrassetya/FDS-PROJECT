import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  WhiteListAdd,
  WhiteListDelete,
  WhiteListGet,
  WhiteListGetAllInformation,
  WhiteListGetQuery,
  WhiteListUpdate, WhiteListUpload
} from "./white-list.actions";
import {WhiteListDomain} from "../domain/white-list.domain";
import {StateContext} from "@ngxs/store";
import {FraudListStateModel} from "../../fraud-list/state/fraud-list.state";
import {WhiteListStateModel} from "./white-list.state";

@Injectable({
  providedIn: 'root'
})
export class WhiteListDispatcher {

  @Dispatch()
  public _WhiteListGet() {
    return new WhiteListGet()
  }

  @Dispatch()
  public _WhiteListGetQuery(data: any) {
    return new WhiteListGetQuery(data)
  }

  @Dispatch()
  public _WhiteListAdd(data: WhiteListDomain) {
    return new WhiteListAdd(data)
  }

  @Dispatch()
  public _WhiteListUpdate(currentId: number, data: WhiteListDomain) {
    return new WhiteListUpdate(currentId, data)
  }

  @Dispatch()
  public _WhiteListDelete(id: number) {
    return new WhiteListDelete(id)
  }

  @Dispatch()
  public _WhiteListUpload(data: {file: any, initiatorId: string, uGroupId: string}) {
    return new WhiteListUpload(data)
  }

  @Dispatch()
  public _WhiteListGetAllInformation(action: (ctx: StateContext<WhiteListStateModel>) => void) {
    return new WhiteListGetAllInformation(action)
  }
}
