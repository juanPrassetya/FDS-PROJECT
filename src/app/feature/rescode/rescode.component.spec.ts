import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescodeComponent } from './rescode.component';

describe('RescodeComponent', () => {
  let component: RescodeComponent;
  let fixture: ComponentFixture<RescodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RescodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
