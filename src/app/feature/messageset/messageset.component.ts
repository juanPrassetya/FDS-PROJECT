import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { AuthState } from '../../shared/auth/state/auth.state';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from '../user/domain/user.domain';
import { ConfirmService } from '../../shared/services/confirm.service';
import { AuthService } from '../../shared/services/auth.service';
import { StringUtils } from '../../shared/utils/string.utils';
import { MessagesetState } from './state/messageset.state';
import { MessagesetDomain } from './domain/messageset.component';
import { MessagesetService } from './service/messageset.service';
import {
  MessagesetAdd,
  MessagesetDelete,
  MessagesetGet,
  MessagesetGetQuery,
  MessagesetUpdate,
} from './state/messageset.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-messageset',
  templateUrl: './messageset.component.html',
  styleUrls: ['./messageset.component.css'],
})
export class MessagesetComponent implements OnInit, OnDestroy {
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(MessagesetState.data) messagesets$!: Observable<
    MessagesetDomain[]
  >;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  formGroup!: FormGroup;

  authorities: string[] = [];

  selectedItem: MessagesetDomain | undefined;

  items: Array<MessagesetDomain> = [];

  visibleMessagesetDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = true;

  constructor(
    private store$: Store,
    private action$: Actions,
    private messagesetService: MessagesetService,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      messagesetName: [''],
    });
    this.authorities = this.authService.getAuthorities();

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        if (this.store$.selectSnapshot(MessagesetState.data).length > 0) {
          this.isLoading = false;
        } else {
          this.isLoading = true;
          this.messagesetService.onFetchMessageset();
        }
      } else this.isLoading = false;
    });

    this.messagesets$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.items = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(
          MessagesetAdd,
          MessagesetUpdate,
          MessagesetDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedItem = undefined;
        this.messagesetService.onFetchMessageset();
      });

    this.action$
      .pipe(ofActionCompleted(MessagesetGet), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

    this.action$
      .pipe(
        ofActionErrored(MessagesetAdd, MessagesetUpdate, MessagesetDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionCompleted(MessagesetGetQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$
      .pipe(ofActionErrored(MessagesetGetQuery), takeUntil(this.destroyer$))
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
    this.messagesetService.onFetchMessageset();
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;

    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.messagesetService.onFetchMessagesetQuery(data);
          return
        }
      }
    }

    this.messagesetService.onFetchMessageset();
  }

  onListClicked() {}

  onListUnClicked() {
    this.selectedItem = undefined;
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleMessagesetDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleMessagesetDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.messagesetService.onDeleteMessageset(
        Number(this.selectedItem?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleMessagesetDialog = stat;
  }
}
