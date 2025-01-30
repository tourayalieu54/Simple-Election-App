import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominationManagementComponent } from './nomination-management.component';

describe('NominationManagementComponent', () => {
  let component: NominationManagementComponent;
  let fixture: ComponentFixture<NominationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NominationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
