import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcLabsAllPatientsComponent } from './abc-labs-all-patients.component';

describe('AbcLabsAllPatientsComponent', () => {
  let component: AbcLabsAllPatientsComponent;
  let fixture: ComponentFixture<AbcLabsAllPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbcLabsAllPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbcLabsAllPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
