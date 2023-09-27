import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RuleBodyDomain} from "../../domain/rule-body.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {RuleService} from "../../services/rule.service";
import {TransParamGet} from "../../../transaction-parameter/state/trans-param.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";

@Component({
  selector: 'app-constant-dialog',
  templateUrl: './constant-dialog.component.html',
  styleUrls: ['./constant-dialog.component.css']
})
export class ConstantDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() conditionCounter: number = 1
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected!: RuleBodyDomain
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()
  @Output() onAddItem = new EventEmitter<RuleBodyDomain>()

  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>

  dummyOperator = [
    {code: '=='},
    {code: '!='},
    {code: '<'},
    {code: '>'},
    {code: '<='},
    {code: '>='},
  ];

  dummyHistory = StringUtils.dummyHistory

  dummyDepth = StringUtils.dummyDepth

  private destroyer$ = new Subject();
  form!: FormGroup;
  transParams: Array<TransParamDomain> = []

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private ruleService: RuleService
  ) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      transField_A: ['', Validators.required],
      history_A: ['', Validators.required],
      depth_A: ['', Validators.required],

      relation: ['', Validators.required],

      constant_B: ['', Validators.required]
    })

    this.transParams$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.transParams = data
    })
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
          [ctx.dispatch(new TransParamGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.itemSelected.detailCondition.split(' ').forEach((v1, v1Index) => {
                let v2 = v1.split(';')

                switch (v1Index) {
                  case 0:
                    v2.forEach((v3, v3Index) => {
                      switch (v3Index) {
                        case 1:
                          this.getDepthField()?.setValue(this.dummyDepth.find(depth => depth.code == v3))
                          break

                        case 2:
                          this.getHistoryField()?.setValue(this.dummyHistory.find(depth => depth.code == v3))
                          break

                        case 3:
                          this.getTransField()?.setValue(this.transParams.find(depth => depth.attribute == v3.replace(')', '')))
                          break
                      }
                    })
                    break

                  case 1:
                    this.getRelationField()?.setValue(this.dummyOperator.find(op => op.code == v2[0]))
                    break

                  case 2:
                    this.getConstantField()?.setValue(v2[0].replaceAll(/'/g, ''))
                    break
                }
              })
            }

            setTimeout(() => {
              this.isLoading.emit(false)
            }, 200)
          }
        )
      }
    )
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(formValue: any) {
    let formatValue: string = "$(CONSTANT;depth_A;history_A;transField_A) operator 'constant_B'"

    let formattedValue = formatValue
      .replace('depth_A', formValue.depth_A.code)
      .replace('history_A', formValue.history_A.code)
      .replace('transField_A', formValue.transField_A.attribute)
      .replace('operator', formValue.relation.code)
      .replace('constant_B', formValue.constant_B)

    if (this.dialogMode == 'EDIT') {
      this.onAddItem.emit({
        id: this.itemSelected.id,
        ruleId: this.itemSelected.ruleId,
        conditionId: this.itemSelected.conditionId,
        detailCondition: formattedValue,
        condition: this.itemSelected.condition,
        bindingId: undefined
      })
    } else {
      this.onAddItem.emit({
        id: undefined,
        ruleId: undefined,
        conditionId: 'S' + ('0' + this.conditionCounter).slice(-2),
        detailCondition: formattedValue,
        condition: 'CONSTANT',
        bindingId: undefined
      })
    }

    this.onClose()
  }

  isValueNotValid() {
    return this.getTransField()?.hasError('required') || this.getHistoryField()?.hasError('required') ||
      this.getDepthField()?.hasError('required') || this.getRelationField()?.hasError('required') ||
      this.getConstantField()?.hasError('required')
  }

  getTransField() {
    return this.form.get('transField_A')
  }

  getHistoryField() {
    return this.form.get('history_A')
  }

  getDepthField() {
    return this.form.get('depth_A')
  }

  getRelationField() {
    return this.form.get('relation')
  }

  getConstantField() {
    return this.form.get('constant_B')
  }
}
