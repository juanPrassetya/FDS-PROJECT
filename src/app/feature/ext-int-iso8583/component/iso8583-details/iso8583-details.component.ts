import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Actions, Select} from "@ngxs/store";
import {ExtIntISO8583Service} from "../../service/ext-int-iso8583.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {
  BodyFieldGet,
  getIntRespCode,
  getIntTransactionType,
  HeaderFieldGet,
  MessageConfigurationGetById
} from "../../state/ext-int-iso8583.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {GetResponseCode} from 'src/app/feature/response-code/state/response-code.action';
import {TransactionTypeGet} from 'src/app/feature/transaction-type/state/transaction-type.action';
import {TransParamGetById} from 'src/app/feature/transaction-parameter/state/trans-param.actions';

@Component({
  selector: 'app-iso8583-details',
  templateUrl: './iso8583-details.component.html',
  styleUrls: ['./iso8583-details.component.css']
})
export class Iso8583DetailsComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();

  isLoading: boolean = false
  activeIndex: number = 0

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private action$: Actions,
    private extIntISO8583Service: ExtIntISO8583Service
  ) {
  }

  ngOnInit() {
    this.userData$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      if (data != undefined) {
        this.isLoading = true
        this.extIntISO8583Service.onGetAllInformation(
          (ctx) => {
            const id = Number(this.router.url.split('/').pop())
            ForkJoinHelper(
              [
                ctx.dispatch(new MessageConfigurationGetById(id)),
                ctx.dispatch(new HeaderFieldGet(id)),
                ctx.dispatch(new BodyFieldGet(id)),
                ctx.dispatch(new GetResponseCode(id)),
                ctx.dispatch(new getIntRespCode()),
                ctx.dispatch(new TransactionTypeGet(id)),
                ctx.dispatch(new getIntTransactionType()),
                ctx.dispatch(new TransParamGetById(id))
              ],
              this.destroyer$,
              () => {
                this.isLoading = false
              }
            )
          }
        )
      } else {
        this.isLoading = false
      }
    })
  }

  ngOnDestroy() {
    this.extIntISO8583Service.onResetAllInformation(
      (ctx) => {
        ctx.setState({
          ...ctx.getState(),
          messageConfiguration: undefined,
          headerFields: [],
          bodyFields: [],
          childBodyFields: []
        })
      }
    )
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  onTabChange(event: any) {
    this.activeIndex = event.index
    const className = document.querySelector('.first-container');

    if(event.index != 0) {
      if (!className?.classList.contains('tab-fit')) {
        className?.classList.add('tab-fit');
      }
    } else {
      className?.classList.remove('tab-fit');
    }
  }
}
