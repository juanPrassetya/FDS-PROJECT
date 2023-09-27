import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {StringUtils} from "../../../../shared/utils/string.utils";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateUtils} from "../../../../shared/utils/date.utils";
import {ReportService} from "../../service/report.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-generate-dialog',
  templateUrl: './generate-dialog.component.html',
  styleUrls: ['./generate-dialog.component.css']
})
export class GenerateDialogComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = true
  @Input() itemSelected!: any | undefined
  @Input() groupItemSelected!: any | undefined
  @Output() closeSelf = new EventEmitter<boolean>()
  @Output() isLoading = new EventEmitter<boolean>()

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  visibleExportDialog: boolean = false;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      dateIn: ['', Validators.required],
      dateOut: ['', Validators.required],
    })
  }

  ngOnDestroy() {
    this.form.reset()
  }

  onGenerate() {
    if (this.groupItemSelected.id == 2)
      this.visibleExportDialog = true
    else {
      const data = this.form.getRawValue()
      this.reportService.onGenerateReport(this.itemSelected?.reportId, DateUtils.ConvertToTimestampFormatV3(data.dateIn), DateUtils.ConvertToTimestampFormatV3(data.dateOut))
    }
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  onCloseExport(stat: boolean) {
    this.visibleExportDialog = stat
  }

  isValueNotValid() {
    const stat =
      this.getDateInField()?.hasError('required') || this.getDateOutField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getDateInField() {
    return this.form.get('dateIn')
  }

  getDateOutField() {
    return this.form.get('dateOut')
  }
}
