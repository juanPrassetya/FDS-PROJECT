import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AggregateDomain} from "../../domain/aggregate.domain";
import {RuleService} from "../../services/rule.service";
import {Actions, ofActionCompleted, ofActionErrored, Select, Store} from "@ngxs/store";
import {RuleState} from "../../state/rule.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {RuleGetAggregate, RuleGetAggregateByQuery} from "../../state/rule.actions";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-existing-aggregate-dialog',
  templateUrl: './existing-aggregate-dialog.component.html',
  styleUrls: ['./existing-aggregate-dialog.component.css']
})
export class ExistingAggregateDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() selectedItem: AggregateDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() existingAggregate = new EventEmitter<AggregateDomain>()

  @Select(RuleState.aggregates) aggregates$!: Observable<AggregateDomain[]>

  private destroyer$ = new Subject();

  items: AggregateDomain[] = []
  isLoading: boolean = true

  formGroup!: FormGroup

  constructor(
    private store$: Store,
    private action$: Actions,
    private ruleService: RuleService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: ['']
    })
    this.aggregates$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.items = data;
    })

    this.action$.pipe(
      ofActionCompleted(RuleGetAggregate, RuleGetAggregateByQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$
      .pipe(ofActionErrored(RuleGetAggregateByQuery), takeUntil(this.destroyer$))
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading = true
    this.ruleService.onFetchAllAggregate()
  }

  onClose() {
    this.closeSelf.emit(false)
  }

  onSave() {
    this.existingAggregate.emit(this.selectedItem)
    this.onClose()
  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    const controls = this.formGroup.controls;
    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.ruleService.onFetchAggregateByQuery(data);
          return
        }
      }
    }

    this.ruleService.onFetchAllAggregate();
  }
}
