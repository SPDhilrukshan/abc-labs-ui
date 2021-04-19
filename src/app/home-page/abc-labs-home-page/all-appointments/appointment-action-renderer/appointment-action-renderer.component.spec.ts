import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentActionRendererComponent } from './appointment-action-renderer.component';

describe('AppointmentActionRendererComponent', () => {
  let component: AppointmentActionRendererComponent;
  let fixture: ComponentFixture<AppointmentActionRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentActionRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentActionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
