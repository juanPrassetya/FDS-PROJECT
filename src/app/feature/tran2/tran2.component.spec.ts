import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tran2Component } from './tran2.component';

describe('Tran2Component', () => {
  let component: Tran2Component;
  let fixture: ComponentFixture<Tran2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tran2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tran2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
