import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Actions, Select, ofActionSuccessful } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { JsonEndpointFieldDomain } from '../../domain/json-body-field.domain';
import { ExtIntJSONState } from '../../state/ext-int-json.state';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import { ConfirmService } from 'src/app/shared/services/confirm.service';
import {
  JSONBodyConfigsAddField,
  JSONBodyConfigsDeleteField,
  JSONBodyConfigsUpdateField,
  JSONEndpointAdd,
  JSONEndpointDelete,
  JSONEndpointUpdate,
} from '../../state/ext-int-json.action';

@Component({
  selector: 'app-json-body-field',
  templateUrl: './json-body-field.component.html',
  styleUrls: ['./json-body-field.component.css'],
})
export class JsonBodyFieldComponent implements OnInit, OnDestroy {
  @Select(ExtIntJSONState.bodyFields) bodyFields$!: Observable<
    JsonEndpointFieldDomain[]
  >;
  @Select(ExtIntJSONState.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;

  private destroyer$ = new Subject();
  dialogMode: string = 'add';
  visibleEndpointDialog: boolean = false;
  visibleFieldConfigDialog: boolean = false;
  isLoading: boolean = false;

  formGroup!: FormGroup;
  endpointId: number = 0;
  configChildParentId: number = 0;
  level: number = 0;
  states: string = '';
  prevParentField: number = 0;

  bodyFields: Array<JsonEndpointFieldDomain> = [];
  messageConfiguration: MessageConfigurationDomain | undefined;

  constructor(
    private fb: FormBuilder,
    private action$: Actions,
    private extIntJSONService: ExtIntJSONService,
    private confirmService: ConfirmService
  ) {}
  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }
  ngOnInit(): void {
    this.formGroup = this.fb.group({
      endpoint: [''],
      type: [''],
      length: [''],
    });

    this.bodyFields$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.bodyFields = data;
    });

    this.messageConfigurations$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.messageConfiguration = data;
      });

    this.action$
      .pipe(
        ofActionSuccessful(
          JSONBodyConfigsAddField,
          JSONBodyConfigsUpdateField,
          JSONBodyConfigsDeleteField,
          JSONEndpointAdd,
          JSONEndpointUpdate,
          JSONEndpointDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.selectedFieldConfig = undefined;
        this.extIntJSONService.onGetBodyField(
          Number(this.messageConfiguration?.configId)
        );
      });
  }

  showAddtSearchFilter() {}
  selectedEndpoint: any;
  selectedState: any;
  selectedFieldConfig: any;

  onEndpointSelect(event: any) {
    this.selectedState = undefined;
    this.selectedFieldConfig = undefined;
  }

  selectedStateBtn(event: any, endpoint: any) {
    this.selectedState = event.state;
    this.endpointId = endpoint.endpointId;
    this.selectedFieldConfig = event;
    this.states = event.state;
    console.log(this.states);
  }

  onStateSelect(event: any, endpoint: any) {
    this.selectedEndpoint = undefined;
    this.selectedFieldConfig = undefined;
    this.endpointId = endpoint.endpointId;
    this.states = event.data.state;
    console.log(this.states);
    if (endpoint != undefined) {
      this.selectedState = event.data;
    }
  }

  disabledAddBtn() {
    const condition1 =
      this.selectedEndpoint == undefined &&
      this.selectedState == undefined &&
      this.selectedFieldConfig == undefined;
    const condition2 = this.selectedEndpoint != undefined;
    return condition1 && condition2 ? true : false;
  }

  disabledDeleteBtn() {
    const condition =
      this.selectedEndpoint == undefined &&
      this.selectedFieldConfig == undefined;
    return condition ? true : false;
  }

  disabledUpdateBtn() {
    const condition =
      this.selectedEndpoint == undefined &&
      this.selectedFieldConfig == undefined;
    return condition ? true : false;
  }

  onSelectedFieldConfig(event: any) {
    this.selectedEndpoint = undefined;
    this.selectedState = undefined;
    this.configChildParentId = event.data.id;
    this.level = event.data.level;
  }

  selectedChildFieldBtn(event: any) {
    this.configChildParentId = event.id;
    this.prevParentField = event.id;
  }

  onFieldConfigSelect(event: any) {
    this.selectedFieldConfig = event.data.fieldId;
  }

  select($event: any) {
    console.log($event);
  }

  onCloseEndpointDialog(stat: boolean) {
    this.visibleEndpointDialog = stat;
  }

  onCloseFieldConfigDialog(stat: boolean) {
    this.visibleFieldConfigDialog = stat;
  }

  onAddEndPointDialog() {
    if (
      this.selectedEndpoint == undefined &&
      this.selectedState == undefined &&
      this.selectedFieldConfig == undefined
    ) {
      this.visibleEndpointDialog = true;
      this.dialogMode = 'add';
    } else if (this.selectedEndpoint == undefined) {
      this.visibleFieldConfigDialog = true;
      this.dialogMode = 'add';
    } else if (this.selectedFieldConfig == undefined) {
      this.visibleEndpointDialog = true;
      this.dialogMode = 'add';
    }
  }

  onUpdateEndPointDialog() {
    if (this.selectedEndpoint == undefined) {
      this.visibleFieldConfigDialog = true;
      this.dialogMode = 'update';
    } else if (this.selectedFieldConfig == undefined) {
      this.visibleEndpointDialog = true;
      this.dialogMode = 'update';
    }
  }

  onDeleteJsonBodyDialog() {
    this.confirmService.showDialogConfirm(() => {
      if (this.selectedEndpoint != undefined) {
        this.extIntJSONService.onDeleteEndpoint(
          Number(this.selectedEndpoint?.endpointId)
        );
      } else {
        this.extIntJSONService.onDeleteBodyConfigField(
          Number(this.selectedFieldConfig?.id)
        );
      }
    });
  }

  checkExpandButtonStatus(data: any[]) {
    return data.length == 0;
  }

  checkExpandButtonStyle(data: any[]) {
    if (data.length == 0) {
      return {
        opacity: '0',
        cursor: 'none',
      };
    }
    return {
      opacity: '1',
      cursor: 'pointer',
    };
  }

  calculatePadding(lvl: number): string {
    if (lvl == 0) {
      return `${2}`;
    }
    const basePadding = 2; // 2rem as the base padding
    const paddingIncrement = .8; // 2rem as the increment for each level
    const totalPadding = basePadding + lvl * paddingIncrement;
    return `${totalPadding}`;
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }
}
