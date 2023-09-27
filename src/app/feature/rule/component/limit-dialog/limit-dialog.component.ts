import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {RuleBodyDomain} from "../../domain/rule-body.domain";
import {Actions, ofActionCompleted, Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AggregateDomain} from "../../domain/aggregate.domain";
import {RuleService} from "../../services/rule.service";
import {RuleState} from "../../state/rule.state";
import {RuleGetAggregateById} from "../../state/rule.actions";

@Component({
  selector: 'app-limit-dialog',
  templateUrl: './limit-dialog.component.html',
  styleUrls: ['./limit-dialog.component.css']
})
export class LimitDialogComponent implements OnDestroy {
  @Input() isOpen: boolean = true
  @Input() conditionCounter: number = 1
  @Input() dialogMode: string = 'ADD'
  @Input() aggregateDialogMode: string = 'ADD'
  @Input() itemSelected!: RuleBodyDomain
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()
  @Output() onAddItem = new EventEmitter<RuleBodyDomain>()

  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(RuleState.aggregate) aggregate$!: Observable<AggregateDomain>

  dummyOperator = [
    {code: '=='},
    {code: '!='},
    {code: '<'},
    {code: '>'},
    {code: '<='},
    {code: '>='},
  ];

  private destroyer$ = new Subject();
  form!: FormGroup;
  transParams: Array<TransParamDomain> = []
  selectedAggregate: AggregateDomain | undefined

  visibleAggregateDialog: boolean = false
  visibleExistingAggregateDialog: boolean = false

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private ruleService: RuleService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      aggregate_A: [{value: '', disabled: true}, Validators.required],

      relation: ['', Validators.required],

      constant_B: ['', Validators.required]
    })

    this.aggregate$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.selectedAggregate = data
      if (data != undefined) {
        this.getAggregateField()?.setValue(data.id + ' - ' + data.name)
      }
    })

    this.action$
      .pipe(
        ofActionCompleted(RuleGetAggregateById),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.isLoading.emit(false)
    })
  }

  ngOnDestroy() {
    this.form.reset()
    this.ruleService.onResetAggregate()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  getExistingAggregate(item: AggregateDomain) {
    this.selectedAggregate = item
    this.getAggregateField()?.setValue(item.id + ' - ' + item.name)
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.itemSelected.detailCondition.split(' ').forEach((v1, v1Index) => {
        let v2 = v1.split(';')

        switch (v1Index) {
          case 0:
            v2.forEach((v3, v3Index) => {
              switch (v3Index) {
                case 1:
                  this.ruleService.onFetchAggregateById(Number(v3))
                  break
              }
            })
            break

          case 1:
            this.getRelationField()?.setValue(this.dummyOperator.find(op => op.code == v2[0]))
            break

          case 2:
            this.getConstantField()?.setValue(v2[0])
            break
        }
      })
    } else {
      setTimeout(() => {
        this.isLoading.emit(false)
      }, 200)
    }
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
    this.destroyer$.complete()
  }

  onSave(formValue: any) {
    let formatValue: string = '$(LIMIT;aggregate_A;CARD;hpan) operator constant_B'

    let formattedValue = formatValue
      .replace('operator', formValue.relation.code)
      .replace('constant_B', formValue.constant_B)

    if (this.selectedAggregate != undefined) {
      formattedValue = formattedValue.replace('aggregate_A', String(this.selectedAggregate.id))

      if (this.dialogMode == 'EDIT') {
        this.onAddItem.emit({
          id: this.itemSelected.id,
          ruleId: this.itemSelected.ruleId,
          conditionId: this.itemSelected.conditionId,
          detailCondition: formattedValue,
          condition: this.itemSelected.condition,
          bindingId: this.selectedAggregate.id
        })
      } else {
        this.onAddItem.emit({
          id: undefined,
          ruleId: undefined,
          conditionId: 'S' + ('0' + this.conditionCounter).slice(-2),
          detailCondition: formattedValue,
          condition: 'LIMIT',
          bindingId: this.selectedAggregate.id
        })
      }

      this.onClose()
    }
  }

  onCreateAggregate() {
    this.aggregateDialogMode = 'ADD'
    this.visibleAggregateDialog = true
  }

  onEditAggregate() {
    this.aggregateDialogMode = 'EDIT'
    this.visibleAggregateDialog = true
  }

  onCloseAggregate(stat: boolean) {
    this.visibleAggregateDialog = stat
  }

  onFindExistingAggregate() {
    this.visibleExistingAggregateDialog = true
  }

  onCloseExistingAggaregate(stat: boolean) {
    this.visibleExistingAggregateDialog = stat
  }

  isValueNotValid() {
    const stat = this.getAggregateField()?.hasError('required') || this.getRelationField()?.hasError('required') ||
      this.getConstantField()?.hasError('required')

    if (stat != undefined) {
      return stat
    }

    return true
  }

  getAggregateField() {
    return this.form.get('aggregate_A')
  }

  getRelationField() {
    return this.form.get('relation')
  }

  getConstantField() {
    return this.form.get('constant_B')
  }
}
