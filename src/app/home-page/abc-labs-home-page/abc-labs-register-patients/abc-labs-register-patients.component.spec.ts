import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcLabsRegisterPatientsComponent } from './abc-labs-register-patients.component';

describe('AbcLabsRegisterPatientsComponent', () => {
  let component: AbcLabsRegisterPatientsComponent;
  let fixture: ComponentFixture<AbcLabsRegisterPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbcLabsRegisterPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbcLabsRegisterPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
