import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JsonEndpointDomain } from '../../domain/json-endpoint.domain';
import { ExtIntJSONState } from '../../state/ext-int-json.state';
import { Actions, Select, ofActionSuccessful } from '@ngxs/store';
import {
  JsonConfigsHeaderDomain,
  JsonHeaderFieldDomain,
} from '../../domain/json-header-field.domain';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  JSONEndpointAdd,
  JSONEndpointDelete,
  JSONEndpointUpdate,
  JSONHeaderConfigDeleteField,
  JSONHeaderConfigsAddField,
  JSONHeaderConfigsUpdateField,
  JSONHeaderFieldGet,
} from '../../state/ext-int-json.action';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { ConfirmService } from 'src/app/shared/services/confirm.service';

@Component({
  selector: 'app-json-header-field',
  templateUrl: './json-header-field.component.html',
  styleUrls: ['./json-header-field.component.css'],
})
export class JsonHeaderFieldComponent implements OnInit, OnDestroy {
  @Select(ExtIntJSONState.headerFields) headerFields$!: Observable<
    JsonHeaderFieldDomain[]
  >;
  @Select(ExtIntJSONState.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;

  private destroyer$ = new Subject();
  isLoading: boolean = false;
  formGroup!: FormGroup;
  selectedEndpoint: JsonEndpointDomain | undefined;
  headerFieldItems: Array<JsonHeaderFieldDomain> = [];
  messageConfiguration: MessageConfigurationDomain | undefined;
  componentMode: string = '';

  visibleEndpointDialog: boolean = false;
  visibleFieldConfigDialog: boolean = false;

  endpointId: number = 0;
  states: string = '';

  dialogMode: string = 'add';

  constructor(
    private fb: FormBuilder,
    private extIntJSONService: ExtIntJSONService,
    private action$: Actions,
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

    this.headerFields$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.headerFieldItems = data;
    });

    this.messageConfigurations$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.messageConfiguration = data;
      });

    this.action$
      .pipe(
        ofActionSuccessful(
          JSONHeaderConfigsAddField,
          JSONHeaderConfigsUpdateField,
          JSONHeaderConfigDeleteField,
          JSONEndpointAdd,
          JSONEndpointUpdate,
          JSONEndpointDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.selectedChildFieldConfig = undefined;
        this.extIntJSONService.onGetHeaderField(
          Number(this.messageConfiguration?.configId)
        );
      });
  }

  showAddtSearchFilter() {}

  disabledAddBtn() {
    const condition1 =
      this.selectedEndpoint == undefined &&
      this.selectedState == undefined &&
      this.selectedFieldConfig == undefined;
    const condition2 = this.selectedEndpoint != undefined
    return condition1 && condition2 ? true : false;
  }

  disabledUpdateBtn() {
    const condition =
      this.selectedEndpoint == undefined &&
      this.selectedChildFieldConfig == undefined;
    return condition ? true : false;
  }

  onSearchClicked(data: any) {}
  selectedState: any;
  selectedFieldConfig: any;
  selectedChildFieldConfig: JsonConfigsHeaderDomain | undefined;

  onEndpointSelect(event: any) {
    this.selectedFieldConfig = undefined;
    this.selectedChildFieldConfig = undefined;
    console.log(this.selectedEndpoint);
  }

  selectedStateBtn(event: any, endpoint: any) {
    this.selectedState = event.state;
    this.endpointId = endpoint.endpointId;
    this.selectedFieldConfig = event;
    this.states = event.state;
  }

  onFieldSelect(event: any, endpoint: any) {
    this.endpointId = endpoint.endpointId;
    this.states = this.selectedFieldConfig.state;
    this.selectedEndpoint = undefined;
    this.selectedChildFieldConfig = undefined;
  }

  onChildFieldSelect(event: any) {
    this.selectedEndpoint = undefined;
    this.selectedFieldConfig = undefined;
  }

  onAddEndPointDialog() {
    if (
      this.selectedEndpoint == undefined &&
      this.selectedFieldConfig == undefined &&
      this.selectedChildFieldConfig == undefined
    ) {
      this.visibleEndpointDialog = true;
      this.dialogMode = 'add';
      this.componentMode = 'header'
    } else if (this.selectedEndpoint == undefined) {
      this.visibleFieldConfigDialog = true;
      this.dialogMode = 'add';
    } else if (this.selectedFieldConfig == undefined) {
      this.visibleEndpointDialog = true;
      this.dialogMode = 'add';
    }
  }

  disabledDeleteBtn() {
    const condition1 =
      this.selectedEndpoint == undefined &&
      this.selectedState == undefined &&
      this.selectedChildFieldConfig == undefined;
    return condition1 ? true : false;
  }

  onUpdateEndPointDialog() {
    if (this.selectedEndpoint == undefined) {
      this.visibleFieldConfigDialog = true;
      this.dialogMode = 'update';
    } else if (this.selectedChildFieldConfig == undefined) {
      this.visibleEndpointDialog = true;
      this.dialogMode = 'update';
    }
  }

  onDeleteJsonHeaderDialog() {
    this.confirmService.showDialogConfirm(() => {
      if (this.selectedEndpoint != undefined) {
        this.extIntJSONService.onDeleteEndpoint(
          Number(this.selectedEndpoint?.endpointId)
        );
      } else {
        this.extIntJSONService.onDeleteHeaderConfigsField(
          Number(this.selectedChildFieldConfig?.id)
        );
      }
    });
  }

  onCloseEndpointDialog(stat: boolean) {
    this.visibleEndpointDialog = stat;
  }

  onCloseFieldConfigDialog(stat: boolean) {
    this.visibleFieldConfigDialog = stat;
  }

  onStateSelect(event: any, endpoint: any) {
    if (endpoint != undefined) {
      this.selectedState = event.data;
    }
  }

  onFieldConfigSelect(event: any) {
    this.selectedChildFieldConfig = event.data.fieldId;
  }

  select($event: any) {
    console.log($event);
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
    const paddingIncrement = .8 // 2rem as the increment for each level
    const totalPadding = basePadding + lvl * paddingIncrement;
    return `${totalPadding}`;
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
  }
}
