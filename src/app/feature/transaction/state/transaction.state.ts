import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { lastValueFrom, tap } from 'rxjs';
import { TransactionService } from '../service/transaction.service';
import {
  TransactionAssignFraudFlag,
  TransactionGet,
  TransactionGetAddtData,
  TransactionGetAllInformation,
  TransactionGetByHpan,
  TransactionGetByQuery,
  TransactionGetTriggeredRule,
  TransactionResetAllInformation,
} from './transaction.actions';
import { TriggeredRuleDomain } from '../domain/triggered-rule.domain';
import { NotificationService } from '../../../shared/services/notification.service';
import { TransactionAddtDomain } from '../domain/transaction-addt.domain';
import { TransactionDomain } from '../domain/transaction.domain';

export class TransactionStateModel {
  transactions: Map<string, object>[] = [];
  transactionsByHpan: Map<string, object>[] = [];
  triggeredRule: TriggeredRuleDomain[] = [];
  addtdata: TransactionAddtDomain[] = [];
}

@State<TransactionStateModel>({
  name: 'transState',
  defaults: {
    transactions: [],
    transactionsByHpan: [],
    triggeredRule: [],
    addtdata: [],
  },
})
@Injectable()
export class TransactionState {
  constructor(
    private transactionService: TransactionService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static transactions(state: TransactionStateModel) {
    return state.transactions;
  }

  @Selector()
  static transactionsByHpan(state: TransactionStateModel) {
    return state.transactionsByHpan;
  }

  @Selector()
  static triggeredRule(state: TransactionStateModel) {
    return state.triggeredRule;
  }

  @Selector()
  static addtData(state: TransactionStateModel) {
    return state.addtdata;
  }

  @Action(TransactionGet, { cancelUncompleted: true })
  getData(ctx: StateContext<TransactionStateModel>) {
    return this.transactionService.fetchAllTransaction().pipe(
      tap((response) => {
        ctx.setState({
          ...ctx.getState(),
          transactions: response.responseData,
        });
      })
    );
  }

  @Action(TransactionGetByQuery, { cancelUncompleted: true }) getDataByQuery(
    ctx: StateContext<TransactionStateModel>,
    { data }: TransactionGetByQuery
  ) {
    return this.transactionService.fetchTransactionQuery(data).pipe(
      tap((response) => {
        ctx.setState({
          ...ctx.getState(),
          transactions: response.responseData,
        });
      })
    );
  }

  @Action(TransactionGetByHpan, { cancelUncompleted: true })
  getDataByHpan(
    ctx: StateContext<TransactionStateModel>,
    { data }: TransactionGetByHpan
  ) {
    return this.transactionService.fetchTransactionByHpan(data).pipe(
      tap((response) => {
        ctx.setState({
          ...ctx.getState(),
          transactionsByHpan: response.responseData,
        });
      })
    );
  }

  @Action(TransactionGetTriggeredRule, { cancelUncompleted: true })
  getDataTriggeredRule(
    ctx: StateContext<TransactionStateModel>,
    { utrnno }: TransactionGetTriggeredRule
  ) {
    return this.transactionService.fetchTriggeredRule(utrnno).pipe(
      tap((response) => {
        ctx.setState({
          ...ctx.getState(),
          triggeredRule: response.responseData,
        });
      })
    );
  }

  @Action(TransactionGetAddtData, { cancelUncompleted: true })
  getAddtData(
    ctx: StateContext<TransactionStateModel>,
    { utrnno }: TransactionGetAddtData
  ) {
    return this.transactionService.fetchAddData(utrnno).pipe(
      tap((response) => {
        ctx.setState({
          ...ctx.getState(),
          addtdata: response.responseData,
        });
      })
    );
  }

  @Action(TransactionGetAllInformation, { cancelUncompleted: true })
  getAllInformation(
    ctx: StateContext<TransactionStateModel>,
    { action }: TransactionGetAllInformation
  ) {
    action(ctx);
  }

  @Action(TransactionAssignFraudFlag, { cancelUncompleted: true })
  assignFraudFlag(
    ctx: StateContext<TransactionStateModel>,
    { data }: TransactionAssignFraudFlag
  ) {
    return this.transactionService.assignFlag(data).pipe(
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

  @Action(TransactionResetAllInformation, { cancelUncompleted: true })
  resetTriggeredRule(
    ctx: StateContext<TransactionStateModel>,
    { action }: TransactionResetAllInformation
  ) {
    action(ctx);
  }
}
