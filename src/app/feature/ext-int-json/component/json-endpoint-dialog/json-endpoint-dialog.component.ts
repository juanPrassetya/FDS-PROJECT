import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';
import { JsonEndpointDomain } from '../../domain/json-endpoint.domain';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import {
  JSONActionType,
  JSONEndpointAdd,
  JSONEndpointGetById,
  JSONEndpointUpdate,
} from '../../state/ext-int-json.action';
import { Actions, Select, ofActionCompleted, ofActionSuccessful } from '@ngxs/store';
import { MessageConfigurationDomain } from 'src/app/feature/ext-int-iso8583/domain/message-configuration.domain';
import { ExtIntJSONState } from '../../state/ext-int-json.state';
import { EndpointTypeEnum } from '../../enum/endpoint-type.enum';

@Component({
  selector: 'app-json-endpoint-dialog',
  templateUrl: './json-endpoint-dialog.component.html',
  styleUrls: ['./json-endpoint-dialog.component.css'],
})
export class JsonEndpointDialogComponent implements OnInit, OnDestroy {
  @Select(ExtIntJSONState.messageConfiguration)
  messageConfigurations$!: Observable<MessageConfigurationDomain>;
  @Select(ExtIntJSONState.endpoint)endpoint$!: Observable<JsonEndpointDomain>;
  @Input() isOpen: boolean = true;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Input() selectedItem: JsonEndpointDomain | undefined;
  @Input() dialogMode: string = 'add';
  @Input() componentMode: string = '';

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  form!: FormGroup;
  messageConfiguration: MessageConfigurationDomain | undefined;
  endpoint: JsonEndpointDomain | undefined;
  endpointTypeEnum!: EndpointTypeEnum;

  constructor(
    private fb: FormBuilder,
    private extIntJSONService: ExtIntJSONService,
    private action$: Actions
  ) {}
  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  endpointType = [
    { name: 'AUTH', code: 0 },
    { name: 'ORIGINAL', code: 1 },
    { name: 'REVERSAL', code: 2 },
  ];

  sysMTIDummy = [{ code: '0200' }, { code: '0400' }, { code: '0600' }];

  ngOnInit(): void {
    this.form = this.fb.group({
      url: ['', Validators.required],
      endpointType: ['', Validators.required],
      configId: [''],
    });

    this.messageConfigurations$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.messageConfiguration = data;
      });

      this.endpoint$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
        this.endpoint = data
      })

      this.action$
      .pipe(
        ofActionSuccessful(JSONEndpointAdd, JSONEndpointUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

      this.action$
      .pipe(
        ofActionCompleted(JSONEndpointAdd, JSONEndpointUpdate),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading.emit(false);
      });
  }

  setExistingDataToModel() {
    this.getUrlField()?.setValue(this.endpoint?.url);
    this.endpointType.find((v) => {
      if(v.name == this.endpoint?.endpointType) {
        this.getEndpointTypeField()?.setValue(v)
      }
    })
  }

  onDialogVisible() {
    if(this.dialogMode == 'update') {
      this.isLoading.emit(true);
      this.extIntJSONService.onGetAllInformation((ctx) => {
        forkJoin([
          ctx.dispatch(
            new JSONEndpointGetById(Number(this.selectedItem?.endpointId))
          ),
        ]).subscribe(() => {
          this.setExistingDataToModel();
          this.isValueNotValid();
  
          setTimeout(() => {
            this.isLoading.emit(false);
          }, 300);
        });
      });
    }
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  isValueNotValid() {
    const stat =
      this.getUrlField()?.hasError('required') || this.getEndpointTypeField()?.hasError('required')
    return stat != null ? stat : true;
  }

  onSave(data: any) {
    data.configId = this.messageConfiguration?.configId
    data.endpointType = data.endpointType.code;
    if (this.dialogMode == 'update') {
      data.endpointId = this.endpoint?.endpointId;
      this.extIntJSONService.onUpdateEndpoint(data);
    } else this.extIntJSONService.onAddEndpoint(data);
  }

  getUrlField() {
    return this.form.get('url');
  }

  getEndpointTypeField() {
    return this.form.get('endpointType');
  }
}
