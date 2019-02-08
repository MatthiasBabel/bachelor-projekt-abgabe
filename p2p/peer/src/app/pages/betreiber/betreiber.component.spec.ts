import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetreiberComponent } from './betreiber.component';

describe('BetreiberComponent', () => {
  let component: BetreiberComponent;
  let fixture: ComponentFixture<BetreiberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetreiberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetreiberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
