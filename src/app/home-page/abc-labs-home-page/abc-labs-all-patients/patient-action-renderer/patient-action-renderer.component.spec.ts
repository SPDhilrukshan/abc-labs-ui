import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientActionRendererComponent } from './patient-action-renderer.component';

describe('PatientActionRendererComponent', () => {
  let component: PatientActionRendererComponent;
  let fixture: ComponentFixture<PatientActionRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientActionRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientActionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
