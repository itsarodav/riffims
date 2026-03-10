import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseCardComponent } from './release-card.component';

describe('ReleaseCardComponent', () => {
  let component: ReleaseCardComponent;
  let fixture: ComponentFixture<ReleaseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
