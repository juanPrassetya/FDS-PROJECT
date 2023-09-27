import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {NotificationTypeGet} from "./notif-type.actions";

@Injectable({
  providedIn: 'root'
})
export class NotifTypeDispatcher {

  @Dispatch()
  public _NotificationTypeGet() {
    return new NotificationTypeGet()
  }
}
