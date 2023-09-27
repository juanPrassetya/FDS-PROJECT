import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {TransactionGet} from "../../../../feature/transaction/state/transaction.actions";
import {UserNotificationGet} from "./header.actions";

@Injectable({
  providedIn: 'root'
})
export class HeaderDispatcher {

  @Dispatch()
  public _UserNotificationGet(userId: number) {
    return new UserNotificationGet(userId);
  }
}
