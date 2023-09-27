import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RuleBodyDomain} from "../../domain/rule-body.domain";
import {Actions, Select} from "@ngxs/store";
import {TransParamState} from "../../../transaction-parameter/state/trans-param.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {TransParamDomain} from "../../../transaction-parameter/domain/trans-param.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TransParamService} from "../../../transaction-parameter/service/trans-param.service";
import {FraudListService} from "../../../fraud-list/service/fraud-list.service";
import {FraudListState} from "../../../fraud-list/state/fraud-list.state";
import {FraudListDomain} from "../../../fraud-list/domain/fraud-list.domain";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {RuleService} from "../../services/rule.service";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {TransParamGet} from "../../../transaction-parameter/state/trans-param.actions";
import {FraudListGet} from "../../../fraud-list/state/fraud-list.actions";

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.css']
})
export class ListDialogComponent {
  @Input() isOpen: boolean = true
  @Input() conditionCounter: number = 1
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected!: RuleBodyDomain
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()
  @Output() onAddItem = new EventEmitter<RuleBodyDomain>()

  @Select(TransParamState.transParams) transParams$!: Observable<TransParamDomain[]>
  @Select(FraudListState.data) fraudList$!: Observable<FraudListDomain[]>

  dummyOperator = [
    {code: 'contains'},
  ];

  dummyHistory = StringUtils.dummyHistory

  dummyDepth = StringUtils.dummyDepth

  private destroyer$ = new Subject();
  form!: FormGroup;
  transParams: Array<TransParamDomain> = []
  fraudList: Array<FraudListDomain> = []

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

      list_B: ['', Validators.required]
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

  onDialogVisible() {
    this.isLoading.emit(true)

    this.ruleService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new TransParamGet()), ctx.dispatch(new FraudListGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.getRelationField()?.setValue(this.dummyOperator[0])

              this.itemSelected.detailCondition.split('contains').forEach((v1, v1Index) => {
                let v2 = v1.split(';')

                switch (v1Index) {
                  case 0:
                    const v3 = v2[0].match(/\(([^)]+)\)/)
                    if (v3) {
                      this.getListField()?.setValue(this.fraudList.find(depth => depth.listName == v3[0].replace('(', '').replace(')', '')))
                    }
                    break

                  case 1:
                    v2.forEach((v3, v3Index) => {
                      switch (v3Index) {
                        case 1:
                          this.getDepthField()?.setValue(this.dummyDepth.find(depth => depth.code == v3.trim()))
                          break

                        case 2:
                          this.getHistoryField()?.setValue(this.dummyHistory.find(depth => depth.code == v3.trim()))
                          break

                        case 3:
                          this.getTransField()?.setValue(this.transParams.find(depth => depth.attribute == v3.trim().replace(')', '')))
                          break
                      }
                    })
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
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onSave(formValue: any) {
    let formatValue: string = 'fraudList(list_B) operator $(LIST;depth_A;history_A;transField_A)'

    let formattedValue = formatValue
      .replace('depth_A', formValue.depth_A.code)
      .replace('history_A', formValue.history_A.code)
      .replace('transField_A', formValue.transField_A.attribute)
      .replace('operator', formValue.relation.code)
      .replace('list_B', formValue.list_B.listName)

    if (this.dialogMode == 'EDIT') {
      this.onAddItem.emit({
        id: this.itemSelected.id,
        ruleId: this.itemSelected.ruleId,
        conditionId: this.itemSelected.conditionId,
        detailCondition: formattedValue,
        condition: this.itemSelected.condition,
        bindingId: (this.getListField()?.getRawValue() as any).listId
      })
    } else {
      this.onAddItem.emit({
        id: undefined,
        ruleId: undefined,
        conditionId: 'S' + ('0' + this.conditionCounter).slice(-2),
        detailCondition: formattedValue,
        condition: 'LIST',
        bindingId: (this.getListField()?.getRawValue() as any).listId
      })
    }

    this.onClose()
  }

  isValueNotValid() {
    return this.getTransField()?.hasError('required') || this.getHistoryField()?.hasError('required') ||
      this.getDepthField()?.hasError('required') || this.getRelationField()?.hasError('required') ||
      this.getListField()?.hasError('required')
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

  getListField() {
    return this.form.get('list_B')
  }
}
