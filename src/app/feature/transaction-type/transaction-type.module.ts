import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTypeComponent } from './transaction-type.component';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { TransactionTypeService } from './service/transaction-type.service';
import { TransactiontypecrudComponent } from './component/transactiontypecrud/transactiontypecrud.component';



@NgModule({
  declarations: [
    TransactionTypeComponent,
    TransactiontypecrudComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    TransactionTypeComponent
  ],
  providers: [
    TransactionTypeService
  ]
})
export class TransactionTypeModule { }
