import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllLabTestsComponent } from './all-lab-tests.component';

describe('AllLabTestsComponent', () => {
  let component: AllLabTestsComponent;
  let fixture: ComponentFixture<AllLabTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllLabTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllLabTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
