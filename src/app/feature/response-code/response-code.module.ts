import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseCodeComponent } from './response-code.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { ResponseCodeService } from './service/response-code.service';
import { ResponsecodecrudComponent } from './component/responsecodecrud/responsecodecrud.component';



@NgModule({
  declarations: [
    ResponseCodeComponent,
    ResponsecodecrudComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ResponseCodeComponent
  ],
  providers: [
    ResponseCodeService
  ]
})
export class ResponseCodeModule { }
