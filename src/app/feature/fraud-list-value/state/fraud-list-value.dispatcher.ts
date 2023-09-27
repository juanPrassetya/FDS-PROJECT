import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  FraudListValueAdd,
  FraudListValueDelete,
  FraudListValueGetById, FraudListValueResetAllInformation,
  FraudListValueUpdate, FraudListValueUpload
} from "./fraud-list-value.actions";
import {FraudListValueDomain} from "../domain/fraud-list-value.domain";
import {StateContext} from "@ngxs/store";
import {FraudListValueStateModel} from "./fraud-list-value.state";
import {WhiteListUpload} from "../../white-list/state/white-list.actions";

@Injectable({
  providedIn: 'root'
})
export class FraudListValueDispatcher {

  @Dispatch()
  public _FraudListValueGetById(id: number) {
    return new FraudListValueGetById(id)
  }

  @Dispatch()
  public _FraudListValueAdd(data: FraudListValueDomain) {
    return new FraudListValueAdd(data)
  }

  @Dispatch()
  public _FraudListValueUpdate(currentValue: string, data: FraudListValueDomain) {
    return new FraudListValueUpdate(currentValue, data)
  }

  @Dispatch()
  public _FraudListValueDelete(id: number) {
    return new FraudListValueDelete(id)
  }

  @Dispatch()
  public _FraudListValueUpload(data: {file: any, author: string, listId: string}) {
    return new FraudListValueUpload(data)
  }


  @Dispatch()
  public _FraudListValueResetAllInformation(action: (ctx: StateContext<FraudListValueStateModel>) => void) {
    return new FraudListValueResetAllInformation(action)
  }
}
