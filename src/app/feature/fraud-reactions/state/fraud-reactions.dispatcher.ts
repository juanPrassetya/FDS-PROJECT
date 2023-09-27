import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  FraudReactionsAdd,
  FraudReactionsDelete,
  FraudReactionsGet,
  FraudReactionsGetAllInformation,
  FraudReactionsGetByBindingIdAndType,
  FraudReactionsGetQuery,
  FraudReactionsResetState,
  FraudReactionsUpdate
} from "./fraud-reactions.actions";
import {FraudReactionsDomain} from "../domain/fraud-reactions.domain";
import {StateContext} from "@ngxs/store";
import {FraudReactionStateModel} from "./fraud-reactions.state";

@Injectable({
  providedIn: 'root'
})
export class FraudReactionsDispatcher {

  @Dispatch()
  public _FraudReactionsGet() {
    return new FraudReactionsGet()
  }

  @Dispatch()
  public _FraudReactionsGetQuery(data: any) {
    return new FraudReactionsGetQuery(data)
  }

  @Dispatch()
  public _FraudReactionsGetByBindingIdAndType(id: number, type: string) {
    return new FraudReactionsGetByBindingIdAndType(id, type)
  }

  @Dispatch()
  public _FraudReactionsAdd(data: FraudReactionsDomain) {
    return new FraudReactionsAdd(data)
  }

  @Dispatch()
  public _FraudReactionsUpdate(data: FraudReactionsDomain) {
    return new FraudReactionsUpdate(data)
  }

  @Dispatch()
  public _FraudReactionsDelete(id: number) {
    return new FraudReactionsDelete(id)
  }

  @Dispatch()
  public _FraudReactionsGetAllInformation(action: (ctx: StateContext<FraudReactionStateModel>) => void) {
    return new FraudReactionsGetAllInformation(action)
  }

  @Dispatch()
  public _FraudReactionsResetState(action: (ctx: StateContext<FraudReactionStateModel>) => void) {
    return new FraudReactionsResetState(action)
  }
}
