import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AidParameterComponent } from './aid-parameter.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { AidParameterService } from './service/aid-parameter.service';
import { AidparamcrudComponent } from './component/aidparamcrud/aidparamcrud.component';



@NgModule({
  declarations: [
    AidParameterComponent,
    AidparamcrudComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    AidParameterService
  ]
})
export class AidParameterModule { }
