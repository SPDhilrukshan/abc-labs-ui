import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLabTestsComponent } from './register-lab-tests.component';

describe('RegisterLabTestsComponent', () => {
  let component: RegisterLabTestsComponent;
  let fixture: ComponentFixture<RegisterLabTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterLabTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
