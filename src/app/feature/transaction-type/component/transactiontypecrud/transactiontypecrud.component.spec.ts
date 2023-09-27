import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactiontypecrudComponent } from './transactiontypecrud.component';

describe('TransactiontypecrudComponent', () => {
  let component: TransactiontypecrudComponent;
  let fixture: ComponentFixture<TransactiontypecrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactiontypecrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactiontypecrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
