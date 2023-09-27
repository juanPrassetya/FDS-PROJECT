import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {StringUtils} from 'src/app/shared/utils/string.utils';
import {NotifTemplateDomain} from "../../domain/notif-template.domain";
import {Actions, ofActionSuccessful, Select} from "@ngxs/store";
import {NotifTypeState} from "../../../notification-type/state/notif-type.state";
import {Observable, Subject, takeUntil} from "rxjs";
import {NotifTypeDomain} from "../../../notification-type/domain/notif-type.domain";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotifTemplateService} from "../../service/notif-template.service";
import {NotifTemplateAdd, NotifTemplateUpdate} from "../../state/notif-template.actions";
import {ForkJoinHelper} from "../../../../shared/utils/rxjs.utils";
import {NotificationTypeGet} from "../../../notification-type/state/notif-type.actions";

@Component({
  selector: 'app-notification-template-dialog',
  templateUrl: './notif-template-dialog.component.html',
  styleUrls: ['./notif-template-dialog.component.css']
})
export class NotifTemplateDialogComponent implements OnInit, OnDestroy {
  @ViewChild('templateInput', { static: false }) textInput!: ElementRef;

  @Input() isOpen: boolean = true
  @Input() dialogMode: string = 'ADD'
  @Input() itemSelected: NotifTemplateDomain | undefined
  @Output() closeSelf = new EventEmitter<boolean>();
  @Output() isLoading = new EventEmitter<boolean>();

  @Select(NotifTypeState.data) notifTypes$!: Observable<NotifTypeDomain[]>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  form!: FormGroup;
  notifTypes: Array<NotifTypeDomain> = []

  currentId: number = 0

  constructor(
    private action$: Actions,
    private fb: FormBuilder,
    private notifTemplateService: NotifTemplateService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      notificationType: ['', Validators.required],
      subjectText: ['', Validators.required],
      templateText: ['', Validators.required],
      description: [''],
      placeholder: ['', Validators.required],
    })

    this.notifTypes$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      this.notifTypes = data
      if (this.dialogMode == 'EDIT' && data.length > 0) {
        this.getNotificationTypeField()?.setValue(this.notifTypes.find(v1 => v1.notificationType == this.itemSelected?.notificationType.notificationType))
      }
    })

    this.action$
      .pipe(
        ofActionSuccessful(NotifTemplateAdd, NotifTemplateUpdate),
        takeUntil(this.destroyer$)
      ).subscribe(() => { this.onClose() })

    // this.action$
    //   .pipe(
    //     ofActionCompleted(NotifTemplateAdd, NotifTemplateUpdate),
    //     takeUntil(this.destroyer$)
    //   ).subscribe(() => { this.isLoading.emit(false) })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onDialogVisible() {
    this.isLoading.emit(true)

    this.notifTemplateService.onGetAllInformation(
      (ctx) => {
        ForkJoinHelper(
          [ctx.dispatch(new NotificationTypeGet())],
          this.destroyer$,
          () => {
            if (this.dialogMode == 'EDIT') {
              this.currentId = this.itemSelected != undefined ? Number(this.itemSelected.templateId) : 0

              this.getSubjectField()?.setValue(this.itemSelected?.subjectText)
              this.getTemplateField()?.setValue(this.itemSelected?.templateText)
              this.getDescriptionField()?.setValue(this.itemSelected?.description)
            }

            this.isLoading.emit(false)
          }
        )
      }
    )
  }

  onSave(data: any) {
    this.isLoading.emit(true)

    if (this.dialogMode == 'EDIT') {
      this.notifTemplateService.onUpdateNotifTemplate(this.currentId, data)
    } else this.notifTemplateService.onAddNotifTemplate(data)
  }

  onClose() {
    this.form.reset()
    this.closeSelf.emit(false)
  }

  isValueNotValid() {
    const stat = this.getNotificationTypeField()?.getRawValue() == '' || this.getSubjectField()?.hasError('required') ||
      this.getTemplateField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  isPlaceholderValid() {
    const stat = this.getPlaceholderField()?.hasError('required')
    return stat != undefined ? stat : true
  }

  getNotificationTypeField() {
    return this.form.get('notificationType')
  }

  getSubjectField() {
    return this.form.get('subjectText')
  }

  getTemplateField() {
    return this.form.get('templateText')
  }

  getDescriptionField() {
    return this.form.get('description')
  }

  getPlaceholderField() {
    return this.form.get('placeholder')
  }

  addPlaceholder(ph: string): void {
    const cursorPosition = this.textInput.nativeElement.selectionStart;
    const currentValue = this.textInput.nativeElement.value;
    const newValue = currentValue.substring(0, cursorPosition) +
      ph +
      currentValue.substring(cursorPosition);

    this.textInput.nativeElement.value = newValue
    this.getTemplateField()?.setValue(newValue)

    this.textInput.nativeElement.setSelectionRange(newValue.length, newValue.length);
    this.textInput.nativeElement.focus();
    this.getTemplateField()?.updateValueAndValidity()
  }
}
