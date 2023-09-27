import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  RecipientGroupAdd,
  RecipientGroupDelete,
  RecipientGroupGet, RecipientGroupGetAllInformation,
  RecipientGroupGetQuery,
  RecipientGroupUpdate
} from "./recipient-group.actions";
import {RecipientGroupDomain} from "../domain/recipient-group.domain";
import {StateContext} from "@ngxs/store";
import {RecipientGroupStateModel} from "./recipient-group.state";

@Injectable({
  providedIn: 'root'
})
export class RecipientGroupDispatcher {

  @Dispatch()
  public _RecipientGroupGet() {
    return new RecipientGroupGet()
  }

  @Dispatch()
  public _RecipientGroupGetQuery(data: any) {
    return new RecipientGroupGetQuery(data)
  }

  @Dispatch()
  public _RecipientGroupAdd(data: RecipientGroupDomain) {
    return new RecipientGroupAdd(data)
  }

  @Dispatch()
  public _RecipientGroupUpdate(currentId: number, data: RecipientGroupDomain) {
    return new RecipientGroupUpdate(currentId, data)
  }

  @Dispatch()
  public _RecipientGroupDelete(id: number) {
    return new RecipientGroupDelete(id)
  }

  @Dispatch()
  public _RecipientGroupGetAllInformation(action: (ctx: StateContext<RecipientGroupStateModel>) => void) {
    return new RecipientGroupGetAllInformation(action)
  }
}
