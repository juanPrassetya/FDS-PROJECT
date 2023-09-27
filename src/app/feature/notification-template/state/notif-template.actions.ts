import {NotifTemplateDomain} from "../domain/notif-template.domain";
import {StateContext} from "@ngxs/store";
import {NotifTemplateStateModel} from "./notif-template.state";

export class NotifTemplateGet {
  static readonly type = '[NotifTemplate] FetchNotifTemplate'
}

export class NotifTemplateGetQuery {
  static readonly type = '[NotifTemplate] FetchNotifTemplate Query'
  constructor(public data: any) {}
}

export class NotifTemplateAdd {
  static readonly type = '[NotifTemplate] NotifTemplateAdd'
  constructor(
    public data: NotifTemplateDomain
  ) {
  }
}

export class NotifTemplateUpdate {
  static readonly type = '[NotifTemplate] NotifTemplateUpdate'

  constructor(
    public currentId: number,
    public data: NotifTemplateDomain
  ) {
  }
}

export class NotifTemplateDelete {
  static readonly type = '[NotifTemplate] NotifTemplateDelete'

  constructor(
    public id: number
  ) {
  }
}

export class NotifTemplateGetAllInformation {
  static readonly type = '[NotifTemplate] NotifTemplateGetAllInformation'

  constructor(
    public action: (ctx: StateContext<NotifTemplateStateModel>) => void,
  ) {
  }
}
