import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  RuleGroupAdd,
  RuleGroupDelete,
  RuleGroupGet,
  RuleGroupGetAllInformation, RuleGroupGetQuery, RuleGroupResetAllInformation,
  RuleGroupUpdate
} from "./rule-group.actions";
import {RuleGroupDomain} from "../domain/rule-group.domain";
import {StateContext} from "@ngxs/store";
import {WhiteListStateModel} from "../../white-list/state/white-list.state";
import {RuleGroupStateModel} from "./rule-group.state";

@Injectable({
  providedIn: 'root'
})
export class RuleGroupDispatcher {
  @Dispatch()
  public _RuleGroupGet(id: number) {
    return new RuleGroupGet(id)
  }

  @Dispatch()
  public _RuleGroupGetQuery(data: any) {
    return new RuleGroupGetQuery(data)
  }

  @Dispatch()
  public _RuleGroupAdd(data: RuleGroupDomain) {
    return new RuleGroupAdd(data)
  }

  @Dispatch()
  public _RuleGroupUpdate(data: RuleGroupDomain) {
    return new RuleGroupUpdate(data)
  }

  @Dispatch()
  public _RuleGroupDelete(id: number) {
    return new RuleGroupDelete(id)
  }

  @Dispatch()
  public _RuleGroupGetAllInformation(action: (ctx: StateContext<RuleGroupStateModel>) => void) {
    return new RuleGroupGetAllInformation(action)
  }

  @Dispatch()
  public _RuleGroupResetAllInformation(action: (ctx: StateContext<RuleGroupStateModel>) => void) {
    return new RuleGroupResetAllInformation(action)
  }
}
