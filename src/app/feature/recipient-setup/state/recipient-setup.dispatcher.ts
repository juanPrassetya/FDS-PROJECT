import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  RecipientSetupAdd,
  RecipientSetupDelete,
  RecipientSetupGet, RecipientSetupGetAllInformation,
  RecipientSetupGetQuery,
  RecipientSetupUpdate
} from "./recipient-setup.actions";
import {RecipientSetupDomain} from "../domain/recipient-setup.domain";
import {StateContext} from "@ngxs/store";
import {RecipientSetupStateModel} from "./recipient-setup.state";

@Injectable({
  providedIn: 'root'
})
export class RecipientSetupDispatcher {

  @Dispatch()
  public _RecipientSetupGet() {
    return new RecipientSetupGet()
  }

  @Dispatch()
  public _RecipientSetupGetQuery(data: any) {
    return new RecipientSetupGetQuery(data)
  }

  @Dispatch()
  public _RecipientSetupAdd(data: RecipientSetupDomain) {
    return new RecipientSetupAdd(data)
  }

  @Dispatch()
  public _RecipientSetupUpdate(currentId: number, data: RecipientSetupDomain) {
    return new RecipientSetupUpdate(currentId, data)
  }

  @Dispatch()
  public _RecipientSetupDelete(id: number) {
    return new RecipientSetupDelete(id)
  }

  @Dispatch()
  public _RecipientSetupGetAllInformation(action: (ctx: StateContext<RecipientSetupStateModel>) => void) {
    return new RecipientSetupGetAllInformation(action)
  }
}
