import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsecodecrudComponent } from './responsecodecrud.component';

describe('ResponsecodecrudComponent', () => {
  let component: ResponsecodecrudComponent;
  let fixture: ComponentFixture<ResponsecodecrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsecodecrudComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsecodecrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
