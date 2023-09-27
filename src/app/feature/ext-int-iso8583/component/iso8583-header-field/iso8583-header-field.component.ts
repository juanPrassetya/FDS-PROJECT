import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderFieldDomain} from "../../domain/header-field.domain";
import {Observable, Subject, takeUntil} from "rxjs";
import {AuthService} from "../../../../shared/services/auth.service";
import {ConfirmService} from "../../../../shared/services/confirm.service";
import {StringUtils} from "../../../../shared/utils/string.utils";
import {ExtIntISO8583Service} from "../../service/ext-int-iso8583.service";
import {Actions, ofActionCompleted, ofActionErrored, ofActionSuccessful, Select} from "@ngxs/store";
import {ExtIntISO8583State} from "../../state/ext-int-iso8583.state";
import {
  HeaderFieldAdd,
  HeaderFieldDelete,
  HeaderFieldGet,
  HeaderFieldGetQuery,
  HeaderFieldUpdate
} from "../../state/ext-int-iso8583.actions";
import {MessageConfigurationDomain} from "../../domain/message-configuration.domain";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-iso8583-header-field',
  templateUrl: './iso8583-header-field.component.html',
  styleUrls: ['./iso8583-header-field.component.css']
})
export class Iso8583HeaderFieldComponent implements OnInit, OnDestroy {
  @Select(ExtIntISO8583State.headerFields) headerFields$!: Observable<HeaderFieldDomain[]>
  @Select(ExtIntISO8583State.messageConfiguration) msgConfiguration$!: Observable<MessageConfigurationDomain>

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;
  authorities: string[] = [];
  formGroup!: FormGroup;

  msgConfiguration: MessageConfigurationDomain | undefined
  selectedItem: HeaderFieldDomain | undefined
  headerFields: Array<HeaderFieldDomain> = []

  visibleHeaderDialog: boolean = false
  visibleHeaderDetailDialog: boolean = false
  visibleSearchDialog: boolean = false;

  dialogMode: string = 'ADD'
  isLoading: boolean = false

  constructor(
    private action$: Actions,
    private extIntISO8583Service: ExtIntISO8583Service,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private fb: FormBuilder
  ) {
  }

  searchFilterFields = new Map<number, any[]>([
    [
      0,
      [
        {name: 'Priority', type: 1, field: 'priority'},
        {name: 'Format Id', type: 2,},
        { name: 'Encoding Id', type: 3, },
      ],
    ],
    [
      1,
      [
        {name: 'Config Id', type: 4},
        {},
        {}
      ]
    ]
  ]);

  hasChilds = [
    {name: 'Yes', code: true},
    {name: 'No', code: false}
  ]

  ngOnInit() {
    this.formGroup = this.fb.group({
      fieldId: [''],
      length: [''],
      hasChild: [false],
      priority: [''],
      formatId: [''],
      encodingId: [''],
      configId: [''],
    });
    this.authorities = this.authService.getAuthorities()

    this.msgConfiguration$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
        this.msgConfiguration = data
    })

    this.headerFields$
      .pipe(
        takeUntil(this.destroyer$)
      ).subscribe(data => {
      if (data != undefined) {
        this.headerFields = data
      }
    })

    this.action$.pipe(
      ofActionSuccessful(HeaderFieldAdd, HeaderFieldUpdate, HeaderFieldDelete),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = true
      this.selectedItem = undefined
      if (this.msgConfiguration != undefined)
        this.extIntISO8583Service.onGetHeaderField(Number(this.msgConfiguration.configId))
    })

    this.action$.pipe(
      ofActionCompleted(HeaderFieldGet),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionCompleted(HeaderFieldGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })

    this.action$.pipe(
      ofActionErrored(HeaderFieldGetQuery),
      takeUntil(this.destroyer$)
    ).subscribe(() => {
      this.isLoading = false
    })
  }

  ngOnDestroy() {
    this.destroyer$.next(true)
    this.destroyer$.complete()
  }

  onListClicked() {

  }

  onSearchClicked(data: any) {
    this.isLoading = true;
    data.encodingId = data.encodingId.encodingId
    data.formatId = data.formatId.formatId;
    data.configId = this.msgConfiguration?.configId;
    data.hasChild = data.hasChild.code

    const controls = this.formGroup.controls;
    for (const controlName in controls) {
      if(controls.hasOwnProperty(controlName)) {
        const controlValue = controls[controlName].value;
        if(controlValue != null && controlValue != undefined && controlValue != '') {
          this.extIntISO8583Service.onGetHeaderFieldQuery(data);
          return
        }
      }
    }

    this.extIntISO8583Service.onGetHeaderField(Number(this.msgConfiguration?.configId));
  }

  showAddtSearchFilter() {
    this.visibleSearchDialog = !this.visibleSearchDialog
  }

  onListUnClicked() {
    this.selectedItem = undefined
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD'
    this.visibleHeaderDialog = true
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT'
    this.isLoading = true
    this.visibleHeaderDialog = true
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true
      this.extIntISO8583Service.onDeleteHeaderField(Number(this.selectedItem?.id))
    })
  }

  onCloseListDialog(stat: boolean) {
    this.visibleHeaderDialog = stat
  }

  onDetailClicked(item: any) {
    this.selectedItem = item
    this.visibleHeaderDetailDialog = true
  }

  onCloseDetail(stat: boolean) {
    this.visibleHeaderDetailDialog = stat
  }

  onLoading(stat: boolean) {
    this.isLoading = stat
  }
}
