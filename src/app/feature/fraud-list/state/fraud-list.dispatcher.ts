import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  FraudListAdd,
  FraudListDelete,
  FraudListGet,
  FraudListGetAllInformation,
  FraudListGetByEntity, FraudListGetQuery, FraudListResetAllInformation,
  FraudListUpdate
} from "./fraud-list.actions";
import {FraudListDomain} from "../domain/fraud-list.domain";
import {StateContext} from "@ngxs/store";
import {FraudListStateModel} from "./fraud-list.state";

@Injectable({
  providedIn: 'root'
})
export class FraudListDispatcher {
  @Dispatch()
  public _FraudListGet() {
    return new FraudListGet()
  }

  @Dispatch()
  public _FraudListGetQuery(data: any) {
    return new FraudListGetQuery(data)
  }

  @Dispatch()
  public _FraudListGetByEntity(entity: number) {
    return new FraudListGetByEntity(entity)
  }

  @Dispatch()
  public _FraudListAdd(data: FraudListDomain) {
    return new FraudListAdd(data)
  }

  @Dispatch()
  public _FraudListUpdate(currentListName: string, data: FraudListDomain) {
    return new FraudListUpdate(currentListName, data)
  }

  @Dispatch()
  public _FraudListDelete(id: number) {
    return new FraudListDelete(id)
  }

  @Dispatch()
  public _FraudListGetAllInformation(action: (ctx: StateContext<FraudListStateModel>) => void) {
    return new FraudListGetAllInformation(action)
  }

  @Dispatch()
  public _FraudListResetAllInformation(action: (ctx: StateContext<FraudListStateModel>) => void) {
    return new FraudListResetAllInformation(action)
  }
}
