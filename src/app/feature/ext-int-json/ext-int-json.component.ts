import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {AuthState} from "../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../user/domain/user.domain";
import {MessageConfigurationDomain} from "../ext-int-iso8583/domain/message-configuration.domain";
import {ExtIntJSONState} from "./state/ext-int-json.state";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {ExtIntJSONService} from "./service/ext-int-json.service";
import {AuthService} from "../../shared/services/auth.service";
import {ConfirmService} from "../../shared/services/confirm.service";
import {ExtIntISO8583State} from "../ext-int-iso8583/state/ext-int-iso8583.state";
import {RoutePathEnum} from "../../shared/enum/route-path.enum";
import {
  JSONMessageConfigurationAdd,
  JSONMessageConfigurationDelete,
  JSONMessageConfigurationGet,
  JSONMessageConfigurationGetQuery
} from "./state/ext-int-json.action";
import {StringUtils} from "../../shared/utils/string.utils";

@Component({
  selector: 'app-ext-int-json',
  templateUrl: './ext-int-json.component.html',
  styleUrls: ['./ext-int-json.component.css']
})
export class ExtIntJsonComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ExtIntJSONState.messageConfigurations) messageConfigurations$!: Observable<MessageConfigurationDomain[]>;
  @Select(ExtIntJSONState.messageConfiguration) addedMsgConfiguration$!: Observable<MessageConfigurationDomain>;

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
    private extIntJSONService: ExtIntJSONService,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [''],
      hasHeader: [''],
      msgType: [2]
    })

    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (
          this.store$.selectSnapshot(ExtIntJSONState.messageConfigurations)
            .length > 0
        ) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.extIntJSONService.onGetMessageConfiguration();
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
        ofActionSuccessful(JSONMessageConfigurationAdd),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        if (this.messageConfiguration != undefined) {
          this.ngZone.run(() => {
            this.router
              .navigate([
                RoutePathEnum.EXT_INT_JSON_VIEW_PATH +
                '/' +
                this.messageConfiguration?.configId.toString(),
              ])
              .then();
          });
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful(JSONMessageConfigurationDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.extIntJSONService.onGetMessageConfiguration();
      });

    this.action$
      .pipe(
        ofActionErrored(JSONMessageConfigurationAdd, JSONMessageConfigurationDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(JSONMessageConfigurationGet),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionCompleted(JSONMessageConfigurationGetQuery),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(JSONMessageConfigurationGetQuery), takeUntil(this.destroyer$))
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
    this.extIntJSONService.onGetMessageConfiguration();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    if(data.hasHeader) {
      data.hasHeader = data.hasHeader.code;
    }
    data.msgType = 2;

    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if (controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if (controlValue != null && controlValue != '') {
          this.extIntJSONService.onGetMessageConfigurationQuery(data);
          return
        }
      }
    }

    this.extIntJSONService.onGetMessageConfiguration();
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
      this.extIntJSONService.onDeleteMessageConfiguration(
        Number(this.selectedItem?.configId)
      );
    });
  }

  onCloseConfigDialog(stat: boolean) {
    this.visibleMessageConfigurationDialog = stat;
  }
}
