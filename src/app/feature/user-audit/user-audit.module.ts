import {NgModule} from '@angular/core';
import {UserAuditComponent} from './user-audit.component';
import {SharedModule} from "../../shared/module/shared.module";
import {UserAuditDetailComponent} from './component/user-audit-detail/user-audit-detail.component';


@NgModule({
  declarations: [
    UserAuditComponent,
    UserAuditDetailComponent
  ],
    imports: [
        SharedModule
    ]
})
export class UserAuditModule { }
