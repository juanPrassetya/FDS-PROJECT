import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectsetComponent } from './connectset.component';

describe('ConnectsetComponent', () => {
  let component: ConnectsetComponent;
  let fixture: ComponentFixture<ConnectsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectsetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
