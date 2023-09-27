import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';
import { RuleGroupDomain } from '../domain/rule-group.domain';
import { RuleGroupService } from '../service/rule-group.service';
import {
  RuleGroupAdd,
  RuleGroupDelete,
  RuleGroupGet,
  RuleGroupGetAllInformation,
  RuleGroupGetQuery,
  RuleGroupResetAllInformation,
  RuleGroupUpdate,
} from './rule-group.actions';
import { lastValueFrom, tap } from 'rxjs';
import { ResetRuleById, RuleGetByGroupId } from '../../rule/state/rule.actions';
import {
  FraudReactionsGetByBindingIdAndType,
  FraudReactionsResetState,
} from '../../fraud-reactions/state/fraud-reactions.actions';

export class RuleGroupStateModel {
  data: RuleGroupDomain[] = [];
}

@State<RuleGroupStateModel>({
  name: 'ruleGroupState',
  defaults: {
    data: [],
  },
})
@Injectable()
export class RuleGroupState {
  constructor(
    private ruleGroupService: RuleGroupService,
    private notificationService: NotificationService
  ) {}

  @Selector()
  static data(state: RuleGroupStateModel) {
    return state.data;
  }

  @Action(RuleGroupGet, { cancelUncompleted: true })
  getData(ctx: StateContext<RuleGroupStateModel>, {id}: RuleGroupGet) {
    return this.ruleGroupService.getRuleGroup(id).pipe(
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

  @Action(RuleGroupGetQuery, { cancelUncompleted: true }) getDataQuery(
    ctx: StateContext<RuleGroupStateModel>,
    { data }: RuleGroupGetQuery
  ) {
    return this.ruleGroupService.getRuleGroupQuery(data).pipe(
      tap((response) => {
        ctx.setState({
          ...ctx.getState(),
          data: response.responseData,
        });
      })
    );
  }

  @Action(RuleGroupAdd, { cancelUncompleted: true })
  addData(ctx: StateContext<RuleGroupStateModel>, { data }: RuleGroupAdd) {
    return this.ruleGroupService.addRuleGroup(data).pipe(
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

  @Action(RuleGroupUpdate, { cancelUncompleted: true })
  updateData(
    ctx: StateContext<RuleGroupStateModel>,
    { data }: RuleGroupUpdate
  ) {
    return this.ruleGroupService.updateRuleGroup(data).pipe(
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

  @Action(RuleGroupDelete, { cancelUncompleted: true })
  deleteData(ctx: StateContext<RuleGroupStateModel>, { id }: RuleGroupDelete) {
    return this.ruleGroupService.deleteRuleGroup(id).pipe(
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

  @Action(RuleGroupGetAllInformation, { cancelUncompleted: true })
  getDataAllInfo(
    ctx: StateContext<RuleGroupStateModel>,
    { action }: RuleGroupGetAllInformation
  ) {
    action(ctx);
  }

  @Action(RuleGroupResetAllInformation, { cancelUncompleted: true })
  resetAllInfo(
    ctx: StateContext<RuleGroupStateModel>,
    { action }: RuleGroupResetAllInformation
  ) {
    action(ctx);
  }
}
