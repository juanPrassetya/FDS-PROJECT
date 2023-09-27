import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AlertInvestigationService } from '../service/alert-investigation.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { lastValueFrom, tap } from 'rxjs';
import {
  AlertInvestigationActionForwardedTo,
  AlertInvestigationClassifyAlert,
  AlertInvestigationGet,
  AlertInvestigationGetAllInformation,
  AlertInvestigationGetDemografi,
  AlertInvestigationGetHistory,
  AlertInvestigationGetLockByUsername,
  AlertInvestigationGetQuery,
  AlertInvestigationGetTriggeredRule,
  AlertInvestigationLockCase,
  AlertInvestigationTakeAction,
  AlertInvestigationUnLockCase,
} from './alert-investigation.actions';
import { AlertInvestigationHistoryDomain } from '../domain/alert-investigation-history.domain';
import {
  TransactionGetByHpan,
  TransactionGetTriggeredRule,
} from '../../transaction/state/transaction.actions';
import { AlertInvestigationDataDomain } from '../domain/alert-investigation-data.domain';
import { AlertInvestigationDemografiDomain } from '../domain/alert-investigation-demografi.domain';
import { TriggeredRuleDomain } from '../../transaction/domain/triggered-rule.domain';

export class AlertInvestigationStateModel {
  data: AlertInvestigationDataDomain[] = [];
  dataById: AlertInvestigationDataDomain | undefined;
  dataHistory: AlertInvestigationHistoryDomain[] = [];
  dataDemografi: AlertInvestigationDemografiDomain | undefined;
  dataRule: Array<TriggeredRuleDomain> = [];
}

@State<AlertInvestigationStateModel>({
  name: 'alertInvestigationState',
  defaults: {
    data: [],
    dataById: undefined,
    dataHistory: [],
    dataDemografi: undefined,
    dataRule: [],
  },
})
@Injectable()
export class AlertInvestigationState {
  constructor(
    private alertInvestigationService: AlertInvestigationService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: AlertInvestigationStateModel) {
    return state.data;
  }

  @Selector()
  static dataById(state: AlertInvestigationStateModel) {
    return state.dataById;
  }

  @Selector()
  static dataHistory(state: AlertInvestigationStateModel) {
    return state.dataHistory;
  }

  @Selector()
  static dataDemografi(state: AlertInvestigationStateModel) {
    return state.dataDemografi;
  }

  @Selector()
  static dataRule(state: AlertInvestigationStateModel) {
    return state.dataRule;
  }

  @Action(AlertInvestigationGet, { cancelUncompleted: true })
  getData(
    ctx: StateContext<AlertInvestigationStateModel>,
    { lockedBy }: AlertInvestigationGet
  ) {
    return this.alertInvestigationService.getAlertInvestigation(lockedBy).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            data: response.responseData,
          });
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationGetQuery, { cancelUncompleted: true })
  getDataQuery(
    ctx: StateContext<AlertInvestigationStateModel>,
    { data }: AlertInvestigationGetQuery
  ) {
    return this.alertInvestigationService.getAlertInvestigationQuery(data).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            data: response.responseData,
          });
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationGetLockByUsername, { cancelUncompleted: true })
  getDataByUsername(
    ctx: StateContext<AlertInvestigationStateModel>,
    { username }: AlertInvestigationGetLockByUsername
  ) {
    return this.alertInvestigationService.getLockCaseByUsername(username).pipe(
      tap(
        (response) => {
          if (Object.keys(response.responseData).length == 0) {
            ctx.setState({
              ...ctx.getState(),
              dataById: undefined,
            });
          } else {
            ctx.setState({
              ...ctx.getState(),
              dataById: response.responseData,
            });
          }
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationGetHistory, { cancelUncompleted: true })
  getDataHistory(
    ctx: StateContext<AlertInvestigationStateModel>,
    { caseId }: AlertInvestigationGetHistory
  ) {
    return this.alertInvestigationService.getHistoryByCaseId(caseId).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            dataHistory: response.responseData,
          });
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationGetDemografi, { cancelUncompleted: true })
  getDataDemografi(
    ctx: StateContext<AlertInvestigationStateModel>,
    { utrnno, refnum }: AlertInvestigationGetDemografi
  ) {
    return this.alertInvestigationService.getDemografiData(utrnno, refnum).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            dataDemografi: response.responseData,
          });
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationGetTriggeredRule, { cancelUncompleted: true })
  getTriggeredRule(
    ctx: StateContext<AlertInvestigationStateModel>,
    { utrnno }: AlertInvestigationGetTriggeredRule
  ) {
    return this.alertInvestigationService.fetchTriggeredRule(utrnno).pipe(
      tap(
        (response) => {
          ctx.setState({
            ...ctx.getState(),
            dataRule: response.responseData,
          });
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationLockCase, { cancelUncompleted: true })
  lockCase(
    ctx: StateContext<AlertInvestigationStateModel>,
    { data }: AlertInvestigationLockCase
  ) {
    return this.alertInvestigationService.lockCaseAlertInvestigation(data).pipe(
      tap(
        (response) => {
          // this.notificationService.successNotification(response.responseReason, response.responseMessage)
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationUnLockCase, { cancelUncompleted: true })
  unlockCase(
    ctx: StateContext<AlertInvestigationStateModel>,
    { data }: AlertInvestigationUnLockCase
  ) {
    return this.alertInvestigationService
      .unLockCaseAlertInvestigation(data)
      .pipe(
        tap(
          (response) => {
            // this.notificationService.successNotification(response.responseReason, response.responseMessage)
          },
          (error) => {
            if (error.status != 401)
              this.notificationService.errorHttpNotification(error);
          }
        )
      );
  }

  @Action(AlertInvestigationClassifyAlert, { cancelUncompleted: true })
  classifyAlert(
    ctx: StateContext<AlertInvestigationStateModel>,
    { data }: AlertInvestigationClassifyAlert
  ) {
    return this.alertInvestigationService.classifyAlertInvestigation(data).pipe(
      tap(
        (response) => {
          this.notificationService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          if (error.status != 401)
            this.notificationService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(AlertInvestigationTakeAction, { cancelUncompleted: true })
  takeAction(
    ctx: StateContext<AlertInvestigationStateModel>,
    { data }: AlertInvestigationTakeAction
  ) {
    return this.alertInvestigationService
      .takeActionAlertInvestigation(data)
      .pipe(
        tap(
          (response) => {
            this.notificationService.successNotification(
              response.responseReason,
              response.responseMessage
            );
          },
          (error) => {
            if (error.status != 401)
              this.notificationService.errorHttpNotification(error);
          }
        )
      );
  }

  @Action(AlertInvestigationActionForwardedTo, { cancelUncompleted: true })
  forwardedTo(
    ctx: StateContext<AlertInvestigationStateModel>,
    { data }: AlertInvestigationActionForwardedTo
  ) {
    return this.alertInvestigationService
      .forwardedToActionAlertInvestigation(data)
      .pipe(
        tap(
          (response) => {
            this.notificationService.successNotification(
              response.responseReason,
              response.responseMessage
            );
            
          },
          (error) => {
            if (error.status != 401)
              this.notificationService.errorHttpNotification(error);
          }
        )
      );
  }

  @Action(AlertInvestigationGetAllInformation, { cancelUncompleted: true })
  getDataAllInfo(
    ctx: StateContext<AlertInvestigationStateModel>,
    { action }: AlertInvestigationGetAllInformation
  ) {
    // await lastValueFrom(ctx.dispatch(new TransactionGetByHpan(data.hpan)))
    // await lastValueFrom(ctx.dispatch(new AlertInvestigationGetHistory(Number(data.case_id))))
    // await lastValueFrom(ctx.dispatch(new AlertInvestigationGetTriggeredRule(data.utrnno.toString())))
    // await lastValueFrom(ctx.dispatch(new AlertInvestigationGetDemografi(data.utrnno.toString(), data.ref_num)))
    action(ctx);
  }
}
