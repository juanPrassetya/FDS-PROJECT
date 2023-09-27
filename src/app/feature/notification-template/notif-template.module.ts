import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotifTemplateComponent} from './notif-template.component';
import {NotifTemplateDialogComponent} from './component/notif-template-dialog/notif-template-dialog.component';
import {SharedModule} from "../../shared/module/shared.module";
import { NotifTemplateDetailComponent } from './component/notif-template-detail/notif-template-detail.component';


@NgModule({
  declarations: [
    NotifTemplateComponent,
    NotifTemplateDialogComponent,
    NotifTemplateDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class NotifTemplateModule { }
