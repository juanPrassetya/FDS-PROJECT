import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FiltrationDomain} from "../../domain/filtration.domain";
import {FraudListState} from "../../../fraud-list/state/fraud-list.state";
import {FraudListDomain} from "../../../fraud-list/domain/fraud-list.domain";
import {RuleService} from "../../services/rule.service";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {TransParamGet} from "../../../transaction-parameter/state/trans-param.actions";
import {FraudListGet} from "../../../fraud-list/state/fraud-list.actions";

@Component({
  selector: 'app-attribute-dialog',
  templateUrl: './attribute-dialog.component.html',
  styleUrls: ['./attribute-dialog.component.css']
})
export class AttributeDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() conditionCounter: number = 1
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: FiltrationDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()
  @Output() onAddItem = new EventEmitter<FiltrationDomain>()

  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(FraudListState.data) fraudList$!: Observable<FraudListDomain[]>
  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup
  transParams: TransParamDomain[] = []
  fraudList: FraudListDomain[] = []

  dummyAttributeSubOper = [
    {
      code: '-'
    },
    {
      code: 'NOT'
    }
  ]
  dummyAttributeOperator = [
    {
      label: 'DIVISIBLE - Attribute value is divisible by the user-defined value',
      code: 'DIVISIBLE'
    },
    {
      label: 'EQUALS - Attribute value is equal to user-defined value',
      code: 'EQUALS'
    },
    {
      label: 'GREATER - Attribute value is greater than the user-defined value',
      code: 'GREATER'
    },
    {
      label: 'LESS - Attribute value is less than the user-defined value',
      code: 'LESS'
    },
    {
      label: 'LIKE START - Attribute value matches the user-defined pattern start',
      code: 'LIKE_START'
    },
    {
      label: 'LIKE END - Attribute value matches the user-defined pattern end',
      code: 'LIKE_END'
    },
    {
      label: 'LIKE BOTH - Attribute value matches the user-defined pattern both',
      code: 'LIKE_BOTH'
    },
    {
      label: 'LIST - Attribute is present in the user-defined list',
      code: 'LIST'
    },
    {
      label: 'RANGE - Attribute value falls within the user-defined range',
      code: 'RANGE'
    },
  ]

  constructor(
    private fb: FormBuilder,
    private ruleService: RuleService
  ) {
    this.form = this.fb.group({
      operator: [{code: '-'}, Validators.required],
      operatorDetails: ['', Validators.required],
      attribute: ['', Validators.required],
      value: ['', Validators.required],
      minRange: ['', Validators.required],
      maxRange: ['', Validators.required],
    })

    this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.transParams = data
    })

    this.fraudList$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.fraudList = data
    })
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    this.ruleService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new TransParamGet()), ctx.dispatch(new FraudListGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              const subOper = this.dummyAttributeSubOper.find(v1 => v1.code == this.itemSelected?.operator)
              this.getOperatorField()?.setValue(subOper ? subOper : {code: '-'})
              this.getOperatorDetailsField()?.setValue(this.dummyAttributeOperator.find(v1 => v1.code == this.itemSelected?.operatorDetails))
              this.getAttributeField()?.setValue(this.transParams.find(v1 => v1.attribute == this.itemSelected?.attribute))
              this.getMinRangeField()?.setValue(this.itemSelected?.minRange)
              this.getMaxRangeField()?.setValue(this.itemSelected?.maxRange)

              if (this.itemSelected?.operatorDetails == 'LIST') {
                this.getValueField()?.setValue(this.fraudList.find(v1 => v1.listName == this.itemSelected?.value))
              } else
                this.getValueField()?.setValue(this.itemSelected?.value)
            }

            setTimeout(() => {
              this.isLoading.emit(false)
            }, 200)
          }
        )
      }
    )
  }

  onSave(value: any) {
    let fixData = new FiltrationDomain()

    if (this.dialogMode == 'EDIT') {
      if (this.itemSelected != undefined) {
        fixData.filtrationId = this.itemSelected?.filtrationId
        fixData.conditionId = this.itemSelected?.conditionId ? this.itemSelected.conditionId : 'S' + ('0' + this.conditionCounter).slice(-2)
      }
    } else {
      fixData.conditionId = 'S' + ('0' + this.conditionCounter).slice(-2)
    }
    fixData.attribute = value.attribute.attribute
    fixData.operatorDetails = value.operatorDetails.code
    fixData.value = value.value

    if (value.operator.code == 'NOT')
      fixData.operator = value.operator.code
    else
      fixData.operator = undefined


    switch (value.operatorDetails.code) {
      case 'RANGE':
        fixData.isRange = true
        fixData.minRange = value.minRange
        fixData.maxRange = value.maxRange
        fixData.value = value.maxRange + ' - ' + value.minRange
        break

      case 'LIST':
        fixData.value = value.value.listName
        break

      default:
        fixData.isRange = false
        break
    }

    this.onClose()
    this.onAddItem.emit(fixData)
  }

  onClose() {
    this.closeSelf.emit(false)
  }

  operatorIsRange(value: any) {
    return value?.operatorDetails?.code == 'RANGE'
  }

  operatorDetailsIsList(value: any) {
    return value.operatorDetails.code == 'LIST'
  }

  onOperatorDetailsChange(data: any) {
    this.getValueField()?.reset()
  }

  isValueNotValid() {
    const operator = (this.getOperatorDetailsField()?.getRawValue() as any)?.code

    if (operator != 'RANGE') {
      const stat = this.getOperatorDetailsField()?.hasError('required') || this.getAttributeField()?.hasError('required') ||
        this.getValueField()?.hasError('required')

      if (stat != undefined)
        return stat
      else return true
    }

    if (operator == 'RANGE') {
      const stat = this.getOperatorDetailsField()?.hasError('required') || this.getAttributeField()?.hasError('required') ||
        this.getMinRangeField()?.hasError('required') || this.getMaxRangeField()?.hasError('required')

      if (stat != undefined)
        return stat
      else return true
    }

    return true
  }

  getOperatorField() {
    return this.form.get('operator')
  }

  getOperatorDetailsField() {
    return this.form.get('operatorDetails')
  }

  getAttributeField() {
    return this.form.get('attribute')
  }

  getValueField() {
    return this.form.get('value')
  }

  getMinRangeField() {
    return this.form.get('minRange')
  }

  getMaxRangeField() {
    return this.form.get('maxRange')
  }
}
