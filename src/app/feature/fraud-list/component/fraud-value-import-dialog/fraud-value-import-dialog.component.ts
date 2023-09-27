import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../../../user/domain/user.domain";
import {FormBuilder} from "@angular/forms";
import {FileUpload} from "primeng/fileupload";
import {FraudListValueService} from "../../../fraud-list-value/service/fraud-list-value.service";
import {FraudListValueUpload} from "../../../fraud-list-value/state/fraud-list-value.actions";
import {FraudListDomain} from "../../domain/fraud-list.domain";

@Component({
  selector: 'app-fraud-value-import-dialog',
  templateUrl: './fraud-value-import-dialog.component.html',
  styleUrls: ['./fraud-value-import-dialog.component.css']
})
export class FraudValueImportDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Input() selectedFraudList: FraudListDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  userData!: UserDomain;

  private destroyer$ = new Subject();

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private fraudListValueService: FraudListValueService
  ) {
  }

  ngOnInit() {
    this.userData$.pipe(
      takeUntil(this.destroyer$)
    ).subscribe(data => {
      this.userData = data;
    })

    this.action$
      .pipe(
        ofActionSuccessful(FraudListValueUpload),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
      this.onClose()
    })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(RuleImport),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {

  }

  onClose() {
    this.closeSelf.emit(false)
  }

  onFileAdded(event: any) {
    if (event.currentFiles.length > 0) {
      const dom: any = document.querySelector('.p-fileupload-content')?.querySelector('p-messages')
      dom.style.width = 0
      dom.style.display = 'none'
    } else {
      const dom: any = document.querySelector('.p-fileupload-content')?.querySelector('p-messages')
      dom.style.width = '100%'
      dom.style.display = 'block'
    }
  }

  uploadHandler(event: any) {
    if (event.files.length > 0) {
      const file: FileUpload = event.files[0];
      this.isLoading.emit(true)

      if (this.userData != undefined && this.selectedFraudList != undefined)
        this.fraudListValueService.onUpload({
          author: this.userData.username,
          listId: this.selectedFraudList.listId.toString(),
          file: file
        })
    }
  }
}
