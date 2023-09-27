import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {StringUtils} from '../../shared/utils/string.utils';
import {DateUtils} from '../../shared/utils/date.utils';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import {AuthState} from '../../shared/auth/state/auth.state';
import {Observable, Subject, takeUntil} from 'rxjs';
import {UserDomain} from '../user/domain/user.domain';
import {ExtIntISO8583State} from './state/ext-int-iso8583.state';
import {MessageConfigurationDomain} from './domain/message-configuration.domain';
import {ExtIntISO8583Service} from './service/ext-int-iso8583.service';
import {AuthService} from '../../shared/services/auth.service';
import {ConfirmService} from '../../shared/services/confirm.service';
import {
  MessageConfigurationAdd,
  MessageConfigurationDelete,
  MessageConfigurationGet,
  MessageConfigurationGetQuery,
} from './state/ext-int-iso8583.actions';
import {Router} from '@angular/router';
import {RoutePathEnum} from '../../shared/enum/route-path.enum';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-ext-int-iso8583',
  templateUrl: './ext-int-iso8583.component.html',
  styleUrls: ['./ext-int-iso8583.component.css'],
})
export class ExtIntISO8583Component implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ExtIntISO8583State.messageConfigurations) messageConfigurations$!: Observable<MessageConfigurationDomain[]>;
  @Select(ExtIntISO8583State.messageConfiguration) addedMsgConfiguration$!: Observable<MessageConfigurationDomain>;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];

  selectedItem: MessageConfigurationDomain | undefined;
  messageConfigurations: Array<MessageConfigurationDomain> = [];
  messageConfiguration: MessageConfigurationDomain | undefined;
  formGroup!: FormGroup

  visibleMessageConfigurationDialog: boolean = false;

  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private ngZone: NgZone,
    private router: Router,
    private extIntISO8583Service: ExtIntISO8583Service,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [''],
      hasHeader: [''],
      msgType: [1]
    })

    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (
          this.store$.selectSnapshot(ExtIntISO8583State.messageConfigurations)
            .length > 0
        ) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.extIntISO8583Service.onGetMessageConfiguration();
        }
      } else this.isLoading = false;
    });

    this.messageConfigurations$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.messageConfigurations = data;
      });

    this.addedMsgConfiguration$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        if (data != undefined) {
          this.messageConfiguration = data;
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful(MessageConfigurationAdd),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        if (this.messageConfiguration != undefined) {
          this.ngZone.run(() => {
            this.router
              .navigate([
                RoutePathEnum.EXT_INT_ISO8583_VIEW_PATH +
                '/' +
                this.messageConfiguration?.configId.toString(),
              ])
              .then();
          });
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful(MessageConfigurationDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.extIntISO8583Service.onGetMessageConfiguration();
      });

    this.action$
      .pipe(
        ofActionErrored(MessageConfigurationAdd, MessageConfigurationDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(MessageConfigurationGet),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(MessageConfigurationGetQuery),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });
      this.action$
      .pipe(ofActionErrored(MessageConfigurationGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }

  onReset() {
    this.isLoading = true;
    this.formGroup.reset();
    this.extIntISO8583Service.onGetMessageConfiguration();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    if(data.hasHeader) {
      data.hasHeader = data.hasHeader.code;
    }
    data.msgType = 1;

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (controlValue != null && controlValue != '') {
          this.extIntISO8583Service.onGetMessageConfigurationQuery(data);
          return
        }
      }
    }

    this.extIntISO8583Service.onGetMessageConfiguration();
  }

  onConfigUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddConfigDialog() {
    this.visibleMessageConfigurationDialog = true;
  }

  onClickedDeleteConfig() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.extIntISO8583Service.onDeleteMessageConfiguration(
        Number(this.selectedItem?.configId)
      );
    });
  }

  onCloseConfigDialog(stat: boolean) {
    this.visibleMessageConfigurationDialog = stat;
  }
}
