import {NgModule} from '@angular/core';
import {TransParamService} from "./service/trans-param.service";
import {SharedModule} from "../../shared/module/shared.module";
import { TransParamComponent } from './trans-param.component';
import { TransparamcrudComponent } from './component/transparamcrud/transparamcrud.component';


@NgModule({
  declarations: [
    TransParamComponent,
    TransparamcrudComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    TransParamService
  ]
})
export class TransParamModule { }
