import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TransactionTypeService } from '../service/transaction-type.service';
import {
  TransactionTypeGet,
  TransactionTypeAdd,
  TransactionTypeDelete,
  TransactionTypeUpdate,
  TransactionTypeGetQuery,
} from './transaction-type.action';
import { TransactionTypeDomain } from '../domain/transaction-type.domain';

export class TransactionTypeStateModel {
  TransactionType: TransactionTypeDomain[] = [];
}

@State<TransactionTypeStateModel>({
  name: 'TransactionType',
  defaults: {
    TransactionType: [],
  },
})
@Injectable()
export class TransactionTypeState {
  constructor(
    private transTypeService: TransactionTypeService,
    private notifierService: NotificationService
  ) {}

  @Selector()
  static TransactionType(state: TransactionTypeStateModel) {
    return state.TransactionType;
  }

  @Action(TransactionTypeGet, { cancelUncompleted: true }) getDataFromState(
    ctx: StateContext<TransactionTypeStateModel>, {id}: TransactionTypeGet
  ) {
    return this.transTypeService.getAllTransactionType(id).pipe(
      tap((response) => {
        ctx.patchState({
          ...ctx.getState(),
          TransactionType: response.responseData,
        });
      },
      error => {
        if (error.status == 404){
          ctx.setState({
            ...ctx.getState(),
            TransactionType: []
          })
        } else this.notifierService.errorHttpNotification(error)
      }
      
      )
    );
  }

  @Action(TransactionTypeGetQuery, { cancelUncompleted: true }) getDataQueryFromState(
    ctx: StateContext<TransactionTypeStateModel>, {data}: TransactionTypeGetQuery
  ) {
    return this.transTypeService.getAllTransactionTypeQuery(data).pipe(
      tap((response) => {
        ctx.patchState({
          ...ctx.getState(),
          TransactionType: response.responseData,
        });
      },
      error => {
        if (error.status == 404){
          ctx.setState({
            ...ctx.getState(),
            TransactionType: []
          })
        } else this.notifierService.errorHttpNotification(error)
      }
      
      )
    );
  }

  @Action(TransactionTypeAdd, { cancelUncompleted: true }) addDataFromState(
    ctx: StateContext<TransactionTypeStateModel>,
    { payload }: TransactionTypeAdd
  ) {
    return this.transTypeService.addTransactionType(payload).pipe(
      tap(
        (response) => {
          this.notifierService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(TransactionTypeDelete, { cancelUncompleted: true })
  deleteDataFromState(
    ctx: StateContext<TransactionTypeStateModel>,
    { id }: TransactionTypeDelete
  ) {
    return this.transTypeService.deleteTransactionType(id).pipe(
      tap(
        (response) => {
          this.notifierService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }

  @Action(TransactionTypeUpdate, { cancelUncompleted: true })
  updateDataFromState(
    ctx: StateContext<TransactionTypeStateModel>,
    { payload }: TransactionTypeUpdate
  ) {
    return this.transTypeService.updateTransactionType(payload).pipe(
      tap(
        (response) => {
          this.notifierService.successNotification(
            response.responseReason,
            response.responseMessage
          );
        },
        (error) => {
          this.notifierService.errorHttpNotification(error);
        }
      )
    );
  }
}
