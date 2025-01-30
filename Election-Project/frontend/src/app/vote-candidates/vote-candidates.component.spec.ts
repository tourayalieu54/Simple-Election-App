import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteCandidatesComponent } from './vote-candidates.component';

describe('VoteCandidatesComponent', () => {
  let component: VoteCandidatesComponent;
  let fixture: ComponentFixture<VoteCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
