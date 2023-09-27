import {NgModule} from '@angular/core';
import {WhiteListComponent} from "./white-list.component";
import {SharedModule} from "../../shared/module/shared.module";
import {WhiteListService} from "./service/white-list.service";
import { WhiteListDialogComponent } from './component/white-list-dialog/white-list-dialog.component';
import { WhiteListDetailComponent } from './component/white-list-detail/white-list-detail.component';
import { WhiteImportDialogComponent } from './component/white-import-dialog/white-import-dialog.component';

@NgModule({
  declarations: [
    WhiteListComponent,
    WhiteListDialogComponent,
    WhiteListDetailComponent,
    WhiteImportDialogComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    WhiteListComponent
  ],
  providers: [
    WhiteListService
  ]
})
export class WhiteListModule { }
