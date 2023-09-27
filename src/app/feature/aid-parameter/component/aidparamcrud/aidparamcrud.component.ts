import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AidParameterState } from '../../state/aid-parameter.state';
import { AidParameterDomain } from '../../domain/aid-parameter.domain';
import { AidParameterService } from '../../service/aid-parameter.service';
import { AidParameterAdd, AidParameterUpdate } from '../../state/aid-parameter.action';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select, Actions, ofActionSuccessful, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDomain } from 'src/app/feature/user/domain/user.domain';
import { AuthState } from 'src/app/shared/auth/state/auth.state';
import { StringUtils } from 'src/app/shared/utils/string.utils';

@Component({
  selector: 'app-aidparamcrud',
  templateUrl: './aidparamcrud.component.html',
  styleUrls: ['./aidparamcrud.component.css'],
})
export class AidparamcrudComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: AidParameterDomain | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;

  currentId: number = 0;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private aidParamservice: AidParameterService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      aid: ['', Validators.required],
      label: ['', Validators.required],
    });

    this.action$
      .pipe(
        ofActionSuccessful(AidParameterAdd, AidParameterUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.onClose();
      });

    this.action$
      .pipe(
        ofActionCompleted(AidParameterAdd, AidParameterUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false);
      });
  }

  ngOnDestroy() {
    this.form.reset();
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.setExistingDataToModel();
    this.isLoading.emit(false);
  }

  setExistingDataToModel() {
    this.getAidField()?.setValue(this.itemSelected?.aid);
    this.getLabelField()?.setValue(this.itemSelected?.label);
  }

  onSave(data: any) {
    this.isLoading.emit(true);
    if (this.dialogMode == 'EDIT') {
      data.id = this.itemSelected?.id
      this.aidParamservice.onUpdateAidDispatch(data);
    } else this.aidParamservice.onAddAidDispatch(data);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  isValueNotValid() {
    const stat =
      this.getAidField()?.getRawValue() == '' ||
      this.getLabelField()?.hasError('required')
    return stat != undefined ? stat : true;
  }

  getAidField() {
    return this.form.get('aid');
  }

  getLabelField() {
    return this.form.get('label');
  }
}
