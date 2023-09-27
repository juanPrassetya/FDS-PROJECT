import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AuthState } from '../../../../shared/auth/state/auth.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from '../../../user/domain/user.domain';
import { Router } from '@angular/router';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import { ForkJoinHelper } from '../../../../shared/utils/rxjs.utils';
import {
  JSONBodyFieldGet,
  JSONEndpointGet,
  JSONHeaderFieldGet,
  JSONMessageConfigurationGetById,
  getIntRespCode,
  getIntTransactionType,
} from '../../state/ext-int-json.action';
import { GetResponseCode } from 'src/app/feature/response-code/state/response-code.action';
import { TransactionTypeGet } from 'src/app/feature/transaction-type/state/transaction-type.action';
import { ResetTransParamById } from 'src/app/feature/transaction-parameter/state/trans-param.actions';

@Component({
  selector: 'app-json-details',
  templateUrl: './json-details.component.html',
  styleUrls: ['./json-details.component.css'],
})
export class JsonDetailsComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();

  isLoading: boolean = false;
  activeIndex: number = 0;

  constructor(
    private router: Router,
    private extIntJSONService: ExtIntJSONService
  ) {}

  ngOnInit() {
    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        this.isLoading = true;
        this.extIntJSONService.onGetAllInformation((ctx) => {
          const id = Number(this.router.url.split('/').pop());
          ForkJoinHelper(
            [
              ctx.dispatch(new JSONMessageConfigurationGetById(id)),
              ctx.dispatch(new JSONEndpointGet(id)),
              ctx.dispatch(new JSONHeaderFieldGet(id)),
              ctx.dispatch(new JSONBodyFieldGet(id)),
              ctx.dispatch(new GetResponseCode(id)),
              ctx.dispatch(new getIntRespCode()),
              ctx.dispatch(new TransactionTypeGet(id)),
              ctx.dispatch(new getIntTransactionType()),
              // ctx.dispatch(new TransParamGetById(id))
            ],
            this.destroyer$,
            () => {
              this.isLoading = false;
            }
          );
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.extIntJSONService.onResetAllInformation((ctx) => {
      ForkJoinHelper(
        [ctx.dispatch(new ResetTransParamById())],
        this.destroyer$,
        () => {
          this.destroyer$.next(true);
          this.destroyer$.complete();
        }
      );
    });
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }

  onTabChange(event: any) {
    this.activeIndex = event.index;
    const className = document.querySelector('.first-container');

    if (event.index != 0) {
      if (!className?.classList.contains('tab-fit')) {
        className?.classList.add('tab-fit');
      }
    } else {
      className?.classList.remove('tab-fit');
    }
  }
}
