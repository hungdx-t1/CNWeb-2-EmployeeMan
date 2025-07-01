import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlydonnghiviecComponent } from './quanlydonnghiviec.component';

describe('QuanlydonnghiviecComponent', () => {
  let component: QuanlydonnghiviecComponent;
  let fixture: ComponentFixture<QuanlydonnghiviecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlydonnghiviecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlydonnghiviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
