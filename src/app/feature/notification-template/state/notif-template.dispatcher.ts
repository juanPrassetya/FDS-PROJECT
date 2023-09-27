import {Injectable} from "@angular/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
  NotifTemplateAdd,
  NotifTemplateDelete,
  NotifTemplateGet,
  NotifTemplateGetAllInformation,
  NotifTemplateGetQuery,
  NotifTemplateUpdate
} from "./notif-template.actions";
import {NotifTemplateDomain} from "../domain/notif-template.domain";
import {StateContext} from "@ngxs/store";
import {NotifTemplateStateModel} from "./notif-template.state";

@Injectable({
  providedIn: 'root'
})
export class NotifTemplateDispatcher {

  @Dispatch()
  public _NotifTemplateGet() {
    return new NotifTemplateGet()
  }

  @Dispatch()
  public _NotifTemplateGetQuery(data: any) {
    return new NotifTemplateGetQuery(data)
  }

  @Dispatch()
  public _NotifTemplateAdd(data: NotifTemplateDomain) {
    return new NotifTemplateAdd(data)
  }

  @Dispatch()
  public _NotifTemplateUpdate(currentId: number, data: NotifTemplateDomain) {
    return new NotifTemplateUpdate(currentId, data)
  }

  @Dispatch()
  public _NotifTemplateDelete(id: number) {
    return new NotifTemplateDelete(id)
  }

  @Dispatch()
  public _NotifTemplateGetAllInformation(action: (ctx: StateContext<NotifTemplateStateModel>) => void) {
    return new NotifTemplateGetAllInformation(action)
  }
}
