import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResponseCodeState } from '../../state/response-code.state';
import { ResponseCodeDomain } from '../../domain/response-code.domain';
import { ResponseCodeService } from '../../service/response-code.service';
import {
  AddResponseCode,
  UpdateResponseCode,
} from '../../state/response-code.action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Select,
  Actions,
  ofActionSuccessful,
  ofActionCompleted,
} from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserGroupService } from 'src/app/feature/user-group/service/user-group.service';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { ExtIntISO8583State } from 'src/app/feature/ext-int-iso8583/state/ext-int-iso8583.state';

@Component({
  selector: 'app-responsecodecrud',
  templateUrl: './responsecodecrud.component.html',
  styleUrls: ['./responsecodecrud.component.css'],
})
export class ResponsecodecrudComponent {
  @Input() isOpen: boolean = true;
  @Input() selectedItem: ResponseCodeDomain | undefined;
  @Input() selectedMessageConfig: MessageConfigurationDomain | undefined;
  @Input() dialogMode: string = 'add';

  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  // @Select(UserGroupState.userGroups) userGroups$!: Observable<
  //   UserGroupDomain[]
  // >;
  @Select(ExtIntISO8583State.messageConfigurations) messageConfig$!: Observable<
    MessageConfigurationDomain[]
  >;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ResponseCodeState.Responsecode)
  fraudList$!: Observable<ResponseCodeDomain>;

  private destroyer$ = new Subject();
  form!: FormGroup;
  // userGroups: Array<UserGroupDomain> = [];
  userData!: UserDomain;
  messageConfig: Array<MessageConfigurationDomain> = [];

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    public responseCodeService: ResponseCodeService
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.form = this.fb.group({
      respCode: ['', Validators.required],
      description: ['', Validators.required],
      configId: ['', Validators.required],
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.messageConfig$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfig = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(AddResponseCode, UpdateResponseCode),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionCompleted(AddResponseCode, UpdateResponseCode),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false)
      });
  }

  ngOnDestroy() {
    this.destroyer$.complete();
  }

  setExistingDataToModel() {
    this.getResponseCodeField()?.setValue(this.selectedItem?.respCode);
    this.getConfigIdField()?.setValue(this.selectedItem?.configId)
  }

  onDialogVisible() {
    if (this.dialogMode == 'update') {
      this.setExistingDataToModel();
      this.isValueNotValid();
    }
    // this.getDescriptionField()?.setValue(this.userData.userGroup);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    if (this.dialogMode == 'update') {
      data.id = this.selectedItem?.id;
      this.responseCodeService.onUpdateResponseCode(data);
    } else this.responseCodeService.onAddResponseCode(data);
  }
  isValueNotValid() {
    return (
      this.getResponseCodeField()?.getRawValue() == '' ||
      this.getDescriptionField()?.hasError('required') ||
      this.getConfigIdField()?.hasError('required')
    );
  }

  getResponseCodeField() {
    return this.form.get('respCode');
  }

  getDescriptionField() {
    return this.form.get('description');
  }

  getConfigIdField() {
    return this.form.get('configId');
  }
}
