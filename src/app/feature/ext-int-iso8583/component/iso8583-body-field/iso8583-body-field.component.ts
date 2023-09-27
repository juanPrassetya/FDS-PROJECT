import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  Actions,
  ofActionCompleted,
  ofActionErrored,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ExtIntISO8583State } from '../../state/ext-int-iso8583.state';
import { BodyFieldDomain } from '../../domain/body-field.domain';
import { StringUtils } from '../../../../shared/utils/string.utils';
import { ExtIntISO8583Service } from '../../service/ext-int-iso8583.service';
import { ChildBodyFieldDomain } from '../../domain/child-body-field.domain';
import { MessageConfigurationDomain } from '../../domain/message-configuration.domain';
import {
  BodyFieldAdd,
  BodyFieldDelete,
  BodyFieldGet,
  BodyFieldGetQuery,
  BodyFieldUpdate,
  ChildBodyFieldAdd,
  ChildBodyFieldDelete,
  ChildBodyFieldGet,
  ChildBodyFieldUpdate,
  GetBodyChildField,
} from '../../state/ext-int-iso8583.actions';
import { ForkJoinHelper } from '../../../../shared/utils/rxjs.utils';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-iso8583-body-field',
  templateUrl: './iso8583-body-field.component.html',
  styleUrls: ['./iso8583-body-field.component.css'],
})
export class Iso8583BodyFieldComponent implements OnInit, OnDestroy {
  @Select(ExtIntISO8583State.bodyFields) bodyFields$!: Observable<
    BodyFieldDomain[]
  >;
  @Select(ExtIntISO8583State.childBodyFields) childBodyFields$!: Observable<
    ChildBodyFieldDomain[]
  >;
  @Select(ExtIntISO8583State.messageConfiguration)
  msgConfiguration$!: Observable<MessageConfigurationDomain>;

  private destroyer$ = new Subject();
  protected readonly StringUtils = StringUtils;

  authorities: string[] = [];
  formGroup!: FormGroup;

  selectedBodyField!: BodyFieldDomain | undefined;
  selectedChildField!: ChildBodyFieldDomain | undefined;

  msgConfiguration: MessageConfigurationDomain | undefined;
  items: Array<BodyFieldDomain> = [];
  childItems: Array<ChildBodyFieldDomain> = [];

  visibleBodyFieldDialog: boolean = false;
  visibleChildFieldDialog: boolean = false;
  visibleSearchDialog: boolean = false;

  dialogMode: string = 'ADD';
  isLoading: boolean = false;

  constructor(
    private store$: Store,
    private action$: Actions,
    private extIntISO8583Service: ExtIntISO8583Service,
    private confirmService: ConfirmService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

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
    this.authorities = this.authService.getAuthorities();

    this.msgConfiguration$
      .pipe(takeUntil(this.destroyer$))
      .subscribe((data) => {
        this.msgConfiguration = data;
      });

    this.bodyFields$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        this.items = data;
      }
    });

    this.childBodyFields$.pipe(takeUntil(this.destroyer$)).subscribe((data) => {
      if (data != undefined) {
        this.childItems = data;
      }
    });

    this.action$
      .pipe(
        ofActionSuccessful(BodyFieldAdd, BodyFieldUpdate, BodyFieldDelete),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedBodyField = undefined;
        if (this.msgConfiguration != undefined) {
          this.extIntISO8583Service.onGetAllInformation((ctx) => {
            ForkJoinHelper(
              [
                ctx.dispatch(
                  new BodyFieldGet(Number(this.msgConfiguration?.configId))
                ),
                ctx.dispatch(new ChildBodyFieldGet(0)),
              ],
              this.destroyer$,
              () => {
                this.isLoading = false;
              }
            );
          });
        }
      });

    this.action$
      .pipe(
        ofActionSuccessful(
          ChildBodyFieldAdd,
          ChildBodyFieldUpdate,
          ChildBodyFieldDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = true;
        this.selectedChildField = undefined;
        if (
          this.msgConfiguration != undefined &&
          this.selectedBodyField != undefined
        ) {
          this.extIntISO8583Service.onGetAllInformation((ctx) => {
            ForkJoinHelper(
              [
                ctx.dispatch(
                  new BodyFieldGet(Number(this.msgConfiguration?.configId))
                ),
                ctx.dispatch(
                  new ChildBodyFieldGet(Number(this.selectedBodyField?.id))
                ),
              ],
              this.destroyer$,
              () => {
                this.isLoading = false;
              }
            );
          });
        }
      });

    this.action$
      .pipe(
        ofActionErrored(
          BodyFieldAdd,
          BodyFieldUpdate,
          BodyFieldDelete,
          ChildBodyFieldAdd,
          ChildBodyFieldUpdate,
          ChildBodyFieldDelete
        ),
        takeUntil(this.destroyer$)
      )
      .subscribe(() => {
        this.isLoading = false;
      });

      this.action$.pipe(
        ofActionCompleted(BodyFieldGetQuery),
        takeUntil(this.destroyer$)
      ).subscribe(() => {
        this.isLoading = false
      })

    // this.action$.pipe(
    //   ofActionSuccessful(
    //     ChildBodyFieldGet
    //   ),
    //   takeUntil(this.destroyer$)
    // ).subscribe(() => {
    //   this.isLoading = false
    // })
    //
    // this.action$.pipe(
    //   ofActionErrored(
    //     ChildBodyFieldGet
    //   ),
    //   takeUntil(this.destroyer$)
    // ).subscribe(() => {
    //   this.isLoading = false
    // })
  }

  ngOnDestroy() {
    this.destroyer$.next(true);
    this.destroyer$.complete();
  }

  onLoading(stat: boolean) {
    this.isLoading = stat;
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
          this.extIntISO8583Service.onGetBodyFieldQuery(data);
          return
        }
      }
    }

    this.extIntISO8583Service.onGetBodyField(Number(this.msgConfiguration?.configId));
    
  }

  showAddtSearchFilter() {
    this.visibleSearchDialog = !this.visibleSearchDialog;
  }

  onListClicked() {
    this.isLoading = true;
    this.selectedChildField = undefined;
    if (this.selectedBodyField != undefined) this.getChildBodyField();
  }

  onListUnClicked() {
    this.selectedChildField = undefined;
    this.childItems = [];
  }

  onClickedAddListDialog() {
    this.dialogMode = 'ADD';
    this.visibleBodyFieldDialog = true;
  }

  onClickedEditListDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleBodyFieldDialog = true;
  }

  onClickedDeleteList() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.extIntISO8583Service.onDeleteBodyField(
        Number(this.selectedBodyField?.id)
      );
    });
  }

  onCloseListDialog(stat: boolean) {
    this.visibleBodyFieldDialog = stat;
  }

  onClickedAddValueDialog() {
    this.dialogMode = 'ADD';
    this.visibleChildFieldDialog = true;
  }

  onClickedEditValueDialog() {
    this.dialogMode = 'EDIT';
    this.isLoading = true;
    this.visibleChildFieldDialog = true;
  }

  onClickedDeleteValue() {
    this.confirmService.showDialogConfirm(() => {
      this.isLoading = true;
      this.extIntISO8583Service.onDeleteChildBodyField(
        Number(this.selectedChildField?.id)
      );
    });
  }

  onCloseValueDialog(stat: boolean) {
    this.visibleChildFieldDialog = stat;
  }

  getChildBodyField() {
    if (this.selectedBodyField != undefined)
      this.extIntISO8583Service.onGetAllInformation((ctx) => {
        ForkJoinHelper(
          [
            ctx.dispatch(
              new ChildBodyFieldGet(Number(this.selectedBodyField?.id))
            ),
          ],
          this.destroyer$,
          () => {
            this.isLoading = false;
          }
        );
      });
  }
}
