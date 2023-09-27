import {Component, EventEmitter, NgZone, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {MessageConfigurationDomain} from "../../../ext-int-iso8583/domain/message-configuration.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {Router} from "@angular/router";
import {ExtIntISO8583Service} from "../../../ext-int-iso8583/service/ext-int-iso8583.service";
import {MessageConfigurationUpdate} from "../../../ext-int-iso8583/state/ext-int-iso8583.actions";
import {RoutePathEnum} from "../../../../shared/enum/route-path.enum";
import {ExtIntJSONState} from "../../state/ext-int-json.state";

@Component({
  selector: 'app-json-general-setting',
  templateUrl: './json-general-setting.component.html',
  styleUrls: ['./json-general-setting.component.css']
})
export class JsonGeneralSettingComponent implements OnInit, OnDestroy {
  @Select(ExtIntJSONState.messageConfiguration) msgConfiguration$!: Observable<MessageConfigurationDomain>

  @Output() isLoading = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  form!: FormGroup;
  msgConfiguration: MessageConfigurationDomain | undefined
  dummyStatus = StringUtils.dummyStatus
  dummyType = [
    {
      msgId: 2,
      name: 'JSON'
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
          this.router.navigate([RoutePathEnum.EXT_INT_JSON_VIEW_PATH])
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
      this.router.navigate([RoutePathEnum.EXT_INT_JSON_VIEW_PATH])
    })
  }
}
