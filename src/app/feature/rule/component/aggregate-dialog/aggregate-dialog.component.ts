import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {TransParamService} from "../../../transaction-parameter/service/trans-param.service";
import {
  maxHoursValidator,
  maxMinValidator,
  maxThreeDigitsValidator,
  StringUtils
} from "../../../../shared/utils/string.utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AggregateDomain} from "../../domain/aggregate.domain";
import {FiltrationDomain} from "../../domain/filtration.domain";
import {ConfirmService} from "../../../../shared/services/confirm.service";
import {RuleService} from "../../services/rule.service";
import {RuleAddAggregate, RuleUpdateAggregate} from "../../state/rule.actions";
import {NotificationService} from "../../../../shared/services/notification.service";
import {RuleState} from "../../state/rule.state";
import { ForkJoinHelper } from 'src/app/shared/utils/rxjs.utils';
import { TransParamGet } from 'src/app/feature/transaction-parameter/state/trans-param.actions';

@Component({
  selector: 'app-aggregate-dialog',
  templateUrl: './aggregate-dialog.component.html',
  styleUrls: ['./aggregate-dialog.component.css']
})
export class AggregateDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() selectedAggregate: AggregateDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() onAddItem = new EventEmitter<AggregateDomain>()

  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(RuleState.aggregate) aggregate$!: Observable<AggregateDomain>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup
  selectedFiltration!: FiltrationDomain | undefined
  transParams: TransParamDomain[] = []
  filtations: FiltrationDomain[] = []
  fixData!: AggregateDomain
  conditionCounter: number = 1
  currentId: number = 0
  isLoading: boolean = false
  attrDialogMode: string = 'ADD'

  visibleAttributeDialog: boolean = false

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private transParamService: TransParamService,
    private ruleService: RuleService,
    private confirmService: ConfirmService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      days_s: ['', [Validators.required, maxThreeDigitsValidator()]],
      hours_s: ['', [Validators.required, maxHoursValidator()]],
      min_s: ['', [Validators.required, maxMinValidator()]],
      sec_s: ['', [Validators.required, maxMinValidator()]],

      days_e: ['', [Validators.required, maxThreeDigitsValidator()]],
      hours_e: ['', [Validators.required, maxHoursValidator()]],
      min_e: ['', [Validators.required, maxMinValidator()]],
      sec_e: ['', [Validators.required, maxMinValidator()]],

      name: ['', Validators.required],
      description: [''],
      entity: ['', Validators.required],
      attribute: ['', Validators.required],
      metric: ['', Validators.required],
      incMode: ['', Validators.required],
      formula: ['', Validators.required],
      isFormula: [false]
    })

    this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.transParams = data
    })

    this.aggregate$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.fixData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(RuleAddAggregate, RuleUpdateAggregate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
      this.onAddItem.emit(this.fixData)
      this.isLoading = false
    })

    this.action$
      .pipe(
        ofActionCompleted(RuleAddAggregate, RuleUpdateAggregate),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading = true
    this.ruleService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [
            ctx.dispatch(new TransParamGet()),
          ], this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              if (this.selectedAggregate != undefined || this.selectedAggregate) {
                this.getDaysField('s')?.setValue(this.convertToDays(this.selectedAggregate.timeStartCycle))
                this.getHoursField('s')?.setValue(this.convertToHours(this.selectedAggregate.timeStartCycle))
                this.getMinField('s')?.setValue(this.convertToMin(this.selectedAggregate.timeStartCycle))
                this.getSecField('s')?.setValue(this.convertToSec(this.selectedAggregate.timeStartCycle))

                this.getDaysField('e')?.setValue(this.convertToDays(this.selectedAggregate.timeEndCycle))
                this.getHoursField('e')?.setValue(this.convertToHours(this.selectedAggregate.timeEndCycle))
                this.getMinField('e')?.setValue(this.convertToMin(this.selectedAggregate.timeEndCycle))
                this.getSecField('e')?.setValue(this.convertToSec(this.selectedAggregate.timeEndCycle))

                this.getNameField()?.setValue(this.selectedAggregate.name)
                this.getDescriptionField()?.setValue(this.selectedAggregate.description)
                this.getEntityField()?.setValue(this.transParams.find(v1 => v1.attribute == this.selectedAggregate?.aggregatingEntity))
                this.getAttributeField()?.setValue(this.transParams.find(v1 => v1.attribute == this.selectedAggregate?.attribute))
                this.getMetricField()?.setValue(StringUtils.dummyMetric.find(v1 => v1.code == this.selectedAggregate?.metricType))
                this.getIncModeField()?.setValue(StringUtils.dummyIncMode.find(v1 => v1.code == this.selectedAggregate?.incrementationMode))
                this.getFormulaField()?.setValue(this.selectedAggregate.formula)
                this.getIsFormulaField()?.setValue(this.selectedAggregate.isFormulaEnabled)

                this.filtations = [...this.selectedAggregate.filtrations]
                this.currentId = Number(this.selectedAggregate.id)
                this.conditionCounter = this.filtations.length > 0 ? this.extractNumericValue(this.filtations[this.filtations.length - 1].conditionId) + 1 :  1
              }
            }

            setTimeout(() => {
              this.isLoading = false
            }, 200)
          }
        )
      }
    )


  }

  onSave(value: any) {
    this.fixData = new AggregateDomain()

    this.fixData.name = value.name
    this.fixData.description = value.description
    this.fixData.aggregatingEntity = value.entity.attribute
    this.fixData.attribute = value.attribute.attribute
    this.fixData.metricType = value.metric.code
    this.fixData.incrementationMode = value.incMode.code
    this.fixData.cycleType = 1
    this.fixData.timeStartCycle = this.convertToMs('s')
    this.fixData.timeEndCycle = this.convertToMs('e')
    this.fixData.isFormulaEnabled = value.isFormula
    this.fixData.filtrations = this.filtations

    if (this.fixData.isFormulaEnabled) {
      this.fixData.formula = value.formula
    }

    // if (this.fixData.timeEndCycle < this.fixData.timeStartCycle) {
    //   this.notificationService.errorNotification('Restricted', 'End Cycle can\'t be less than start')
    // } else {
    //
    // }

    if (this.dialogMode == 'EDIT') {
      if (this.selectedAggregate != undefined) this.fixData.id = this.selectedAggregate?.id
      this.ruleService.onUpdateAggregate(this.currentId, this.fixData)
    } else
      this.ruleService.onAddAggregate(this.fixData)
  }

  onClose() {
    this.closeSelf.emit(false)
  }

  onAttributeDialogVisible() {
    this.attrDialogMode = 'ADD'
    this.visibleAttributeDialog = true
  }

  onEditAttribute() {
    this.attrDialogMode = 'EDIT'
    this.visibleAttributeDialog = true
  }

  onDeleteAttribute() {
    this.confirmService.showDialogConfirm(() => {
      let existingDataIndex = this.filtations.findIndex(v1 => v1.conditionId == this.selectedFiltration?.conditionId)
      this.filtations.splice(existingDataIndex, 1)
      this.selectedFiltration = undefined
    })
  }

  onAddAttribute(data: FiltrationDomain) {
    let existingData = this.filtations.findIndex(v1 => v1.conditionId == data.conditionId)
    if (this.filtations[existingData]) {
      this.filtations[existingData] = data
      this.selectedFiltration = data
    } else {
      this.filtations = [...this.filtations, data]
    }
    if(this.attrDialogMode == 'ADD') {
      this.conditionCounter += 1
    }
  }

  onCloseAttribute(stat: boolean) {
    this.visibleAttributeDialog = stat
  }

  convertToMs(type: string) {
    const days = this.getDaysField(type)?.getRawValue()
    const hours = this.getHoursField(type)?.getRawValue()
    const min = this.getMinField(type)?.getRawValue()
    const sec = this.getSecField(type)?.getRawValue()

    const daysInMS = days * 24 * 60 * 60 * 1000
    const hoursInMS = hours * 60 * 60 * 1000
    const minInMS = min * 60 * 1000
    const secInMS = sec * 1000

    return daysInMS + hoursInMS + minInMS + secInMS
  }

  convertToDays(value: number) {
    return Math.floor(value / (24 * 60 * 60 * 1000));
  }

  convertToHours(value: number) {
    return Math.floor((value % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  }

  convertToMin(value: number) {
    return Math.floor((value % (60 * 60 * 1000)) / (60 * 1000));
  }

  convertToSec(value: number) {
    return Math.floor((value % (60 * 1000)) / 1000);
  }

  extractNumericValue(inputString: string) {
    const numericPart = inputString.substring(1);
    return parseInt(numericPart, 10);
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }

  isValueNotValid() {
    const stat = this.getNameField()?.hasError('required') || this.getEntityField()?.hasError('required') ||
      this.getAttributeField()?.hasError('required') || this.getMetricField()?.hasError('required') || this.getIncModeField()?.hasError('required')

    if (stat != undefined)
      return stat

    return true
  }

  isFormulaChecked() {
    return (this.getIsFormulaField()?.getRawValue() as boolean)
  }

  getDaysField(type: string) {
    return this.form.get('days_' + type)
  }

  getHoursField(type: string) {
    return this.form.get('hours_' + type)
  }

  getMinField(type: string) {
    return this.form.get('min_' + type)
  }

  getSecField(type: string) {
    return this.form.get('sec_' + type)
  }

  getNameField() {
    return this.form.get('name')
  }

  getDescriptionField() {
    return this.form.get('description')
  }

  getEntityField() {
    return this.form.get('entity')
  }

  getAttributeField() {
    return this.form.get('attribute')
  }

  getMetricField() {
    return this.form.get('metric')
  }

  getIncModeField() {
    return this.form.get('incMode')
  }

  getFormulaField() {
    return this.form.get('formula')
  }

  getIsFormulaField() {
    return this.form.get('isFormula')
  }
}
