import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTestComponent } from './transaction-test.component';

describe('TransactionTestComponent', () => {
  let component: TransactionTestComponent;
  let fixture: ComponentFixture<TransactionTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
