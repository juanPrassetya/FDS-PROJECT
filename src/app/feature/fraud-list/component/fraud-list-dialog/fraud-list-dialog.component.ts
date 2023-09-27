import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FraudListDomain } from '../../domain/fraud-list.domain';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StringUtils } from '../../../../shared/utils/string.utils';
import {
  Actions,
  ofActionCompleted,
  ofActionSuccessful,
  Select,
} from '@ngxs/store';
import { AuthState } from '../../../../shared/auth/state/auth.state';
import { UserDomain } from '../../../user/domain/user.domain';
import { UserGroupDomain } from '../../../user-group/domain/user-group.domain';
import { UserGroupState } from '../../../user-group/state/user-group.state';
import { FraudListService } from '../../service/fraud-list.service';
import { FraudListAdd, FraudListUpdate } from '../../state/fraud-list.actions';
import { FraudListTypeState } from '../../../fraud-list-type/state/fraud-list-type.state';
import { FraudListTypeDomain } from '../../../fraud-list-type/domain/fraud-list-type.domain';
import { FraudListTypeGet } from '../../../fraud-list-type/state/fraud-list-type.actions';
import { UserGroupGet } from '../../../user-group/state/user-group.actions';
import { ForkJoinHelper } from '../../../../shared/utils/rxjs.utils';

@Component({
  selector: 'app-fraud-list-dialog',
  templateUrl: './fraud-list-dialog.component.html',
  styleUrls: ['./fraud-list-dialog.component.css'],
})
export class FraudListDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: FraudListDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(FraudListTypeState.data) fraudListTypes$!: Observable<
    FraudListTypeDomain[]
  >;
  @Select(UserGroupState.userGroups) userGroups$!: Observable<
    UserGroupDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  form!: FormGroup;
  userData!: UserDomain;
  entityTypes: Array<FraudListTypeDomain> = [];
  userGroups: Array<UserGroupDomain> = [];

  currentListName: string = '';

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private fraudListService: FraudListService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      listName: ['', Validators.required],
      entityType: [''],
      userGroup: [{ value: '', disabled: true }, Validators.required],
    });

    this.fraudListTypes$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.entityTypes = data;
    });

    this.userGroups$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userGroups = data;
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(FraudListAdd, FraudListUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    // this.action$
    //   .pipe(
    //     ofActionCompleted(FraudListAdd, FraudListUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.form.reset();
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onDialogVisible() {
    this.fraudListService.onGetAllInformation((ctx) => {
      ForkJoinHelper(
        [
          ctx.dispatch(new FraudListTypeGet()),
          ctx.dispatch(new UserGroupGet()),
        ],
        this.destroyer$,
        () => {
          if (this.dialogMode == 'EDIT') {
            this.currentListName =
              this.itemSelected != undefined ? this.itemSelected.listName : '';

            this.getNameField()?.setValue(this.itemSelected?.listName);
            this.getEntityTypeField()?.setValue(this.itemSelected?.entityType);
            this.getGroupField()?.setValue(this.itemSelected?.userGroup);
          } else {
            this.getGroupField()?.setValue(this.userData.userGroup);
          }

          this.isLoading.emit(false);
        }
      );
    });
  }

  onSave(data: any) {
    this.isLoading.emit(true);

    if (data.entityType == '') {
      data.entityType = undefined
    }

    if (this.dialogMode == 'EDIT') {
      this.fraudListService.onUpdateFraudList(this.currentListName, data);
    } else this.fraudListService.onAddFraudList(data);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  isValueNotValid() {
    return (
      this.getNameField()?.hasError('required') ||
      this.getGroupField()?.hasError('required')
    );
  }

  getNameField() {
    return this.form.get('listName');
  }

  getEntityTypeField() {
    return this.form.get('entityType');
  }

  getGroupField() {
    return this.form.get('userGroup');
  }
}
