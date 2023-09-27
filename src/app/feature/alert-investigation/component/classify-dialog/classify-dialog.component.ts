import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AlertInvestigationDomain} from "../../domain/alert-investigation.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, takeUntil} from "rxjs";
import {AlertInvestigationService} from "../../service/alert-investigation.service";
import {Actions, ofActionCompleted, ofActionSuccessful, Select} from "@ngxs/store";
import {AlertInvestigationClassifyAlert} from "../../state/alert-investigation.actions";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {UserDomain} from "../../../user/domain/user.domain";
import {AlertInvestigationDataDomain} from "../../domain/alert-investigation-data.domain";

@Component({
  selector: 'app-classify-dialog',
  templateUrl: './classify-dialog.component.html',
  styleUrls: ['./classify-dialog.component.css']
})
export class ClassifyDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() itemSelected!: AlertInvestigationDataDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  private destroyer$ = new Subject();

  form!: FormGroup;
  userData!: UserDomain

  dummyClassificationType = [
    { name: 'Negative', code: '10' },
    { name: 'Suspicious', code: '20' },
    { name: 'Positive', code: '30' }
  ]

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private alertInvestigationService: AlertInvestigationService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      classificationType: ['', Validators.required],
      comment: ['', Validators.required]
    })

    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data
    })

    this.action$
      .pipe(
        ofActionSuccessful(AlertInvestigationClassifyAlert),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    this.action$
      .pipe(
        ofActionCompleted(AlertInvestigationClassifyAlert),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.form.reset()
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {

  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onSave(value: any) {
    if(this.itemSelected != undefined){
      this.isLoading.emit(true)
      const alertData = new AlertInvestigationDomain()

      // alertData.caseId = this.itemSelected.case_id
      alertData.caseId = this.itemSelected.case_id
      alertData.clasificationType = value.classificationType.code
      alertData.clasifiedComment = value.comment
      alertData.initiator = this.userData.username

      this.alertInvestigationService.onClassifyAlertInvestigation(alertData)
    }
  }

  isValueNotValid() {
    const stat = this.getClassificationField()?.hasError('required') || this.getCommentField()?.hasError('required')
    if (stat != undefined)
      return stat
    return true;
  }

  getClassificationField() {
    return this.form.get('classificationType')
  }

  getCommentField() {
    return this.form.get('comment')
  }
}
