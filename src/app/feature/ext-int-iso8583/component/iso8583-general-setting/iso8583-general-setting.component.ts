import {Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, takeUntil} from "rxjs";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {MessageConfigurationUpdate} from "../../state/ext-int-iso8583.actions";
import {MessageConfigurationDomain} from "../../domain/message-configuration.domain";
import {ExtIntISO8583Service} from "../../service/ext-int-iso8583.service";
import {ExtIntISO8583State} from "../../state/ext-int-iso8583.state";
import {Router} from "@angular/router";
import {RoutePathEnum} from "../../../../shared/enum/route-path.enum";

@Component({
  selector: 'app-iso8583-general-setting',
  templateUrl: './iso8583-general-setting.component.html',
  styleUrls: ['./iso8583-general-setting.component.css']
})
export class Iso8583GeneralSettingComponent implements OnInit, OnDestroy {
  @Select(ExtIntISO8583State.messageConfiguration) msgConfiguration$!: Observable<MessageConfigurationDomain>

  @Output() isLoading = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  form!: FormGroup;
  msgConfiguration: MessageConfigurationDomain | undefined
  dummyStatus = StringUtils.dummyStatus
  dummyType = [
    {
      msgId: 1,
      name: 'ISO8583'
    }
  ]

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private action$: Actions,
    private extIntISO8583Service: ExtIntISO8583Service
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      msgType: ['', Validators.required],
      hasHeader: ['', Validators.required],
      description: [''],
    })

    this.msgConfiguration$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      if (data != undefined) {
        this.msgConfiguration = data
        this.getNameField()?.setValue(data.name)
        this.getTypeField()?.setValue(data.msgType)
        this.getHeaderField()?.setValue(this.dummyStatus.find(v1 => v1.code == data.hasHeader))
        this.getDescriptionField()?.setValue(data.description)
      }
    })

    this.action$
      .pipe(
        ofActionSuccessful(MessageConfigurationUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.ngZone.run(() => {
          this.router.navigate([RoutePathEnum.EXT_INT_ISO8583_VIEW_PATH])
        })
      }
    )

    this.action$
      .pipe(
        ofActionCompleted(MessageConfigurationUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading.emit(false)
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onSave(value: any) {
    this.isLoading.emit(true)

    const fixData = new MessageConfigurationDomain()
    fixData.name = value.name
    fixData.msgType = value.msgType
    fixData.hasHeader = value.hasHeader.code
    fixData.description = value.description

    if (this.msgConfiguration != undefined)
      fixData.configId = this.msgConfiguration?.configId

    this.extIntISO8583Service.onUpdateMessageConfiguration(fixData)
  }

  isValueNotValid() {
    const stat = this.getNameField()?.hasError('required') || this.getTypeField()?.hasError('required')
    this.getHeaderField()?.hasError('required') || this.getDescriptionField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getNameField() {
    return this.form.get('name')
  }

  getTypeField() {
    return this.form.get('msgType')
  }

  getHeaderField() {
    return this.form.get('hasHeader')
  }

  getDescriptionField() {
    return this.form.get('description')
  }

  onClose() {
    this.ngZone.run(() => {
      this.router.navigate([RoutePathEnum.EXT_INT_ISO8583_VIEW_PATH])
    })
  }
}
