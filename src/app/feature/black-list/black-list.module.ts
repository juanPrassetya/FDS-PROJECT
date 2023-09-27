import {NgModule} from '@angular/core';
import {BlackListComponent} from './black-list.component';
import {SharedModule} from "../../shared/module/shared.module";
import {BlackListService} from "./service/black-list.service";
import { BlackListDetailComponent } from './component/black-list-detail/black-list-detail.component';
import { BlackListDialogComponent } from './component/black-list-dialog/black-list-dialog.component';
import { BlackImportDialogComponent } from './component/black-import-dialog/black-import-dialog.component';

@NgModule({
  declarations: [
    BlackListComponent,
    BlackListDetailComponent,
    BlackListDialogComponent,
    BlackImportDialogComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    BlackListComponent
  ],
  providers: [
    BlackListService
  ]
})
export class BlackListModule { }
