import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { StringUtils } from 'src/app/shared/utils/string.utils';
import { JsonEndpointDomain } from '../../domain/json-endpoint.domain';
import { ExtIntJSONService } from '../../service/ext-int-json.service';
import { JSONEndpointGetById } from '../../state/ext-int-json.action';

@Component({
  selector: 'app-json-body-endpoint-dialog',
  templateUrl: './json-body-endpoint-dialog.component.html',
  styleUrls: ['./json-body-endpoint-dialog.component.css'],
})
export class JsonBodyEndpointDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Input() selectedItem: JsonEndpointDomain | undefined;
  @Input() dialogMode: string = 'add';

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private extIntJSONService: ExtIntJSONService) {}
  ngOnDestroy(): void {
    this.destroyer$.next(true)
    this.destroyer$.complete()
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
      isAuth: ['', Validators.required],
      sysMTI: ['', Validators.required],
    });
  }

  onDialogVisible() {
    this.isLoading.emit(false);
    this.extIntJSONService.onGetAllInformation((ctx) => {
      forkJoin([
        ctx.dispatch(
          new JSONEndpointGetById(Number(this.selectedItem?.endpointId))
        ),
      ]).subscribe(() => {
        if (this.dialogMode == 'update') {
          this.setExistingDataToModel();
          this.isValueNotValid();
        }

        setTimeout(() => {
          this.isLoading.emit(false);
        }, 300);
      });
    });
  }

  setExistingDataToModel() {
    this.getUrlField()?.setValue(this.selectedItem?.url);
    this.getIsAuthField()?.setValue(this.selectedItem?.isAuth);
    this.getSysMTIField()?.setValue(this.selectedItem?.sysMti);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  isValueNotValid() {
    const stat =
      this.getUrlField()?.hasError('required') ||
      this.getIsAuthField()?.hasError('required') ||
      this.getSysMTIField()?.hasError('required');
    return stat != null ? stat : true;
  }

  onSave(data: any) {
    data.isAuth = data.isAuth.code;
    data.sysMTI = data.sysMTI;
    if(this.dialogMode == 'update') {
      this.extIntJSONService.onUpdateEndpoint(data)
    } else this.extIntJSONService.onAddEndpoint(data);
  }

  getUrlField() {
    return this.form.get('field');
  }

  getIsAuthField() {
    return this.form.get('isAuth');
  }

  getSysMTIField() {
    return this.form.get('sysMTI');
  }
}
