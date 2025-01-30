import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionProgressComponent } from './election-progress.component';

describe('ElectionProgressComponent', () => {
  let component: ElectionProgressComponent;
  let fixture: ComponentFixture<ElectionProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
