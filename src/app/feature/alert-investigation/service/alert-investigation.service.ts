import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AlertInvestigationDispatcher } from '../state/alert-investigation.dispatcher';
import { CustomHttpResponse } from '../../../shared/domain/customHttpResponse';
import { AlertInvestigationDomain } from '../domain/alert-investigation.domain';
import { RoutePathEnum } from '../../../shared/enum/route-path.enum';
import { AlertInvestigationHistoryDomain } from '../domain/alert-investigation-history.domain';
import { AlertInvestigationDataDomain } from '../domain/alert-investigation-data.domain';
import { AlertInvestigationDemografiDomain } from '../domain/alert-investigation-demografi.domain';
import { TriggeredRuleDomain } from '../../transaction/domain/triggered-rule.domain';
import { StateContext } from '@ngxs/store';
import { AlertInvestigationStateModel } from '../state/alert-investigation.state';

@Injectable({
  providedIn: 'root',
})
export class AlertInvestigationService {
  private apiUrl = environment.dev_env;

  constructor(
    private http: HttpClient,
    private alertInvestigationDispatcher: AlertInvestigationDispatcher
  ) {}

  getAlertInvestigation(lockedBy: string) {
    return this.http.get<CustomHttpResponse<AlertInvestigationDataDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_GET_PATH}/${lockedBy}`
    );
  }

  getAlertInvestigationQuery(data: any) {
    return this.http.post<CustomHttpResponse<[]>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_QUERY_PATH}`,
      data
    );
  }

  getLockCaseByUsername(username: string) {
    return this.http.get<CustomHttpResponse<AlertInvestigationDataDomain>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_GET_LOCK_BY_USERNAME_PATH}/${username}`
    );
  }

  getHistoryByCaseId(caseId: number) {
    return this.http.get<CustomHttpResponse<AlertInvestigationHistoryDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_GET_HISTORY_PATH}/${caseId}`
    );
  }

  getDemografiData(utrnno: string, refnum: string) {
    const params = new HttpParams()
      .set('utrnno', utrnno)
      .append('refnum', refnum);

    return this.http.get<CustomHttpResponse<AlertInvestigationDemografiDomain>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_GET_DEMOGRAFI_PATH}`,
      { params }
    );
  }

  fetchTriggeredRule(utrnno: string) {
    const params = new HttpParams().set('utrnno', utrnno);

    return this.http.get<CustomHttpResponse<TriggeredRuleDomain[]>>(
      `${this.apiUrl}/${RoutePathEnum.TRANSACTION_GET_TRIGGERED_RULE}`,
      { params }
    );
  }

  lockCaseAlertInvestigation(data: AlertInvestigationDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_LOCK_CASE_PATH}`,
      data
    );
  }

  unLockCaseAlertInvestigation(data: AlertInvestigationDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_UNLOCK_CASE_PATH}`,
      data
    );
  }

  classifyAlertInvestigation(data: AlertInvestigationDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_CLASSIFY_PATH}`,
      data
    );
  }

  takeActionAlertInvestigation(data: AlertInvestigationDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_TAKE_ACTION_PATH}`,
      data
    );
  }

  forwardedToActionAlertInvestigation(data: AlertInvestigationDomain) {
    return this.http.post<CustomHttpResponse<any>>(
      `${this.apiUrl}/${RoutePathEnum.ALERT_INVESTIGATION_FORWARDED_TO_PATH}`,
      data
    );
  }

  onGetAlertInvestigation(lockedBy: string) {
    this.alertInvestigationDispatcher._AlertInvestigationGet(lockedBy);
  }

  onGetAlertInvestigationQuery(data: any) {
    this.alertInvestigationDispatcher._AlertInvestigationGetQuery(data)
  }

  onGetLockCaseByUsername(username: string) {
    this.alertInvestigationDispatcher._AlertInvestigationGetLockByUsername(
      username
    );
  }

  onGetHistoryByCaseId(caseId: number) {
    this.alertInvestigationDispatcher._AlertInvestigationGetHistory(caseId);
  }
  onLockCaseAlertInvestigation(data: AlertInvestigationDomain) {
    this.alertInvestigationDispatcher._AlertInvestigationLockCase(data);
  }

  onUnLockCaseAlertInvestigation(data: AlertInvestigationDomain) {
    this.alertInvestigationDispatcher._AlertInvestigationUnLockCase(data);
  }

  onClassifyAlertInvestigation(data: AlertInvestigationDomain) {
    this.alertInvestigationDispatcher._AlertInvestigationClassifyAlert(data);
  }

  onTakeActionAlertInvestigation(data: AlertInvestigationDomain) {
    this.alertInvestigationDispatcher._AlertInvestigationTakeAction(data);
  }

  onForwardedToActionAlertInvestigation(data: AlertInvestigationDomain) {
    this.alertInvestigationDispatcher._AlertInvestigationActionForwardedTo(
      data
    );
  }

  onGetAllInformation(
    action: (ctx: StateContext<AlertInvestigationStateModel>) => void
  ) {
    this.alertInvestigationDispatcher._AlertInvestigationGetAllInformation(
      action
    );
  }
}
