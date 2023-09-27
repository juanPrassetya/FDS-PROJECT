import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {AuthState} from "../../../../shared/auth/state/auth.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {UserDomain} from "../../../user/domain/user.domain";
import {FormBuilder} from "@angular/forms";
import {FileUpload} from "primeng/fileupload";
import {BlackListService} from "../../service/black-list.service";
import {BlackListUpload} from "../../state/black-list.actions";

@Component({
  selector: 'app-black-import-dialog',
  templateUrl: './black-import-dialog.component.html',
  styleUrls: ['./black-import-dialog.component.css']
})
export class BlackImportDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  @Select(AuthState.userData) userData$!: Observable<UserDomain>

  userData!: UserDomain;

  private destroyer$ = new Subject();

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private blackListService: BlackListService
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
        ofActionSuccessful(BlackListUpload),
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

      if (this.userData != undefined && this.userData.userGroup != undefined)
        this.blackListService.onUpload({
          file: file,
          initiatorId: this.userData.id.toString(),
          uGroupId: this.userData.userGroup.id.toString()
        })
    }
  }
}
