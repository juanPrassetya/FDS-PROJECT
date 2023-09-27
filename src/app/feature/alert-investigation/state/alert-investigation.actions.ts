import {AlertInvestigationDomain} from "../domain/alert-investigation.domain";
import {StateContext} from "@ngxs/store";
import {AlertInvestigationStateModel} from "./alert-investigation.state";

export class AlertInvestigationGet {
  static readonly type = '[AlertInvestigation] FetchAlertInvestigation'

  constructor(
    public lockedBy: string
  ) {
  }
}

export class AlertInvestigationGetQuery {
  static readonly type = '[AlertInvestigation] FetchAlertInvestigationQuery'
  constructor(public data: any) {}
}

export class AlertInvestigationGetLockByUsername {
  static readonly type = '[AlertInvestigation] FetchAlertInvestigationLockByUsername'

  constructor(
    public username: string
  ) {
  }
}

export class AlertInvestigationGetHistory {
  static readonly type = '[AlertInvestigation] FetchAlertInvestigationLockByHistory'

  constructor(
    public caseId: number
  ) {
  }
}

export class AlertInvestigationGetDemografi {
  static readonly type = '[AlertInvestigation] FetchAlertInvestigationDemografi'

  constructor(
    public utrnno: string,
    public refnum: string
  ) {
  }
}

export class AlertInvestigationGetTriggeredRule {
  static readonly type = '[AlertInvestigation] FetchAllAlertInvestigationTriggeredRule'

  constructor(
    public utrnno: string,
  ) {
  }
}

export class AlertInvestigationLockCase {
  static readonly type = '[AlertInvestigation] AlertInvestigationLockCase'

  constructor(
    public data: AlertInvestigationDomain
  ) {
  }
}

export class AlertInvestigationUnLockCase {
  static readonly type = '[AlertInvestigation] AlertInvestigationUnLockCase'

  constructor(
    public data: AlertInvestigationDomain
  ) {
  }
}

export class AlertInvestigationClassifyAlert {
  static readonly type = '[AlertInvestigation] AlertInvestigationClassifyAlert'

  constructor(
    public data: AlertInvestigationDomain
  ) {
  }
}

export class AlertInvestigationTakeAction {
  static readonly type = '[AlertInvestigation] AlertInvestigationTakeAction'

  constructor(
    public data: AlertInvestigationDomain
  ) {
  }
}

export class AlertInvestigationActionForwardedTo {
  static readonly type = '[AlertInvestigation] AlertInvestigationActionForwardedTo'

  constructor(
    public data: AlertInvestigationDomain
  ) {
  }
}

export class AlertInvestigationGetAllInformation {
  static readonly type = '[AlertInvestigation] FetchAlertInvestigationAllInformation'

  constructor(
    public action: (ctx: StateContext<AlertInvestigationStateModel>) => void,
  ) {
  }
}
