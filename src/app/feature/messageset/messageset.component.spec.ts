import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesetComponent } from './messageset.component';

describe('MessagesetComponent', () => {
  let component: MessagesetComponent;
  let fixture: ComponentFixture<MessagesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
