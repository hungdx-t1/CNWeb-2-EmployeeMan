import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonnghiphepComponent } from './donnghiphep.component';

describe('DonnghiphepComponent', () => {
  let component: DonnghiphepComponent;
  let fixture: ComponentFixture<DonnghiphepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonnghiphepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonnghiphepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
