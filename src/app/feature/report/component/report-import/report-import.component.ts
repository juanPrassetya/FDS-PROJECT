import {Component, EventEmitter, Input, OnInit, Output, ViewChild,} from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import {Actions, ofActionCompleted, ofActionSuccessful, Select,} from '@ngxs/store';
import {Observable, Subject, takeUntil} from 'rxjs';
import {UserDomain} from 'src/app/feature/user/domain/user.domain';
import {AuthState} from 'src/app/shared/auth/state/auth.state';
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {ReportService} from '../../service/report.service';
import {FileUpload} from 'primeng/fileupload';
import {ImportColumnReport} from '../../domain/dummy-export.domain';
import {ImportReport} from '../../state/report.actions';

@Component({
  selector: 'app-report-import',
  templateUrl: './report-import.component.html',
  styleUrls: ['./report-import.component.css'],
})
export class ReportImportComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() isOpen: boolean = true;
  @Input() dialogMode: string = 'ADD';
  @Input() itemSelected!: { reportName: string; reportId: number } | undefined;
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();
  @Select(AuthState.userData) userData$!: Observable<UserDomain>;
  file!: FileUpload;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  userData!: UserDomain;

  currentId: number = 0;
  data!: ImportColumnReport;

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      filename: ['', Validators.required],
    });

    this.userData$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      this.userData = data;
    });

    this.action$
      .pipe(
        ofActionSuccessful(ImportReport),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })
  }

  ngOnDestroy() {
    this.form.reset();
    this.destroyer$.next(true)
    this.destroyer$.complete();
  }

  onFileAdded(event: any) {
    if (event.currentFiles.length > 0) {
      const dom: any = document
        .querySelector('.p-fileupload-content')
        ?.querySelector('p-messages');
      dom.style.width = 0;
      dom.style.display = 'none';
    } else {
      const dom: any = document
        .querySelector('.p-fileupload-content')
        ?.querySelector('p-messages');
      dom.style.width = '100%';
      dom.style.display = 'block';
    }
  }

  uploadHandler(event: any) {
    if (event.files.length > 0) {
      const file: FileUpload = event.files[0];
      this.file = file;
      this.isLoading.emit(true);
    }
  }

  onDialogVisible() {
    this.isLoading.emit(false);
  }

  onSave() {
    this.isLoading.emit(true)
    this.fileUpload.upload();
    this.reportService.onImportReport(this.file, this.form.value.filename);
  }

  onClose() {
    this.form.reset();
    this.closeSelf.emit(false);
  }

  isValueNotValid() {}

  getFileNameField() {
    return this.form.get('filename');
  }
}
