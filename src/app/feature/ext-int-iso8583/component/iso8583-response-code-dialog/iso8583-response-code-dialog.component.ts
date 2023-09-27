import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Actions, ofActionCompleted, ofActionSuccessful, Select,} from '@ngxs/store';
import {forkJoin, Observable, Subject, takeUntil} from 'rxjs';
import {ResponseCodeDomain} from 'src/app/feature/response-code/domain/response-code.domain';
import {ResponseCodeService} from 'src/app/feature/response-code/service/response-code.service';
import {AddResponseCode, UpdateResponseCode,} from 'src/app/feature/response-code/state/response-code.action';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {MessageConfigurationDomain} from '../../domain/message-configuration.domain';
import {ExtIntISO8583State} from '../../state/ext-int-iso8583.state';
import {ExtIntISO8583Service} from '../../service/ext-int-iso8583.service';
import {getIntRespCode} from '../../state/ext-int-iso8583.actions';
import {IntResponseCodeDomain} from 'src/app/feature/response-code/domain/int-response-code.domain';

@Component({
  selector: 'app-iso8583-response-code-dialog',
  templateUrl: './iso8583-response-code-dialog.component.html',
  styleUrls: ['./iso8583-response-code-dialog.component.css'],
})
export class Iso8583ResponseCodeDialogComponent {
  @Input() isOpen: boolean = true;
  @Input() selectedItem: ResponseCodeDomain | undefined;
  @Input() selectedMessageConfig: MessageConfigurationDomain | undefined;
  @Input() dialogMode: string = 'add';

  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(ExtIntISO8583State.messageConfiguration)
  messageConfig$!: Observable<MessageConfigurationDomain>;
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  @Select(ExtIntISO8583State.intResponseCode)
  intRespCode$!: Observable<IntResponseCodeDomain[]>;

  private destroyer$ = new Subject();
  form!: FormGroup;
  userData!: UserDomain;
  messageConfig: MessageConfigurationDomain | undefined;
  intRespCodes: Array<IntResponseCodeDomain> = [];

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    public responseCodeService: ResponseCodeService,
    private extIntISO8583Service: ExtIntISO8583Service
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      respCode: ['', Validators.required],
      intResp: ['', Validators.required],
      configId: ['', Validators.required],
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.messageConfig$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.messageConfig = data;
    });

    this.intRespCode$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.intRespCodes = data;
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
        this.isLoading.emit(false);
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete();
  }

  setExistingDataToModel() {
    this.getResponseCodeField()?.setValue(this.selectedItem?.respCode);
    this.getIntResponseCodeField()?.setValue(this.selectedItem?.intResp);
  }

  onDialogVisible() {
    this.isLoading.emit(true);
    this.extIntISO8583Service.onGetAllInformation((ctx) => {
      forkJoin([ctx.dispatch(new getIntRespCode())]).subscribe(() => {
        if (this.dialogMode == 'update') {
          this.setExistingDataToModel();
          this.isValueNotValid();
        }

        this.isLoading.emit(false);
      });
    });
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    data.configId = this.messageConfig
    if (this.dialogMode == 'update') {
      data.id = this.selectedItem?.id
      this.responseCodeService.onUpdateResponseCode(data);
    } else this.responseCodeService.onAddResponseCode(data);
  }
  isValueNotValid() {
    return (
      this.getResponseCodeField()?.getRawValue() == '' ||
      this.getIntResponseCodeField()?.hasError('required')
    );
  }

  getResponseCodeField() {
    return this.form.get('respCode');
  }

  getDescriptionField() {
    return this.form.get('description');
  }

  getIntResponseCodeField() {
    return this.form.get('intResp');
  }
}
