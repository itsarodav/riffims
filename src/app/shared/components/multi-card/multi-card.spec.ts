import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCard } from './multi-card';

describe('MultiCard', () => {
  let component: MultiCard;
  let fixture: ComponentFixture<MultiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
