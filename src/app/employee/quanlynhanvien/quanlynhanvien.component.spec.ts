import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlynhanvienComponent } from './quanlynhanvien.component';

describe('QuanlynhanvienComponent', () => {
  let component: QuanlynhanvienComponent;
  let fixture: ComponentFixture<QuanlynhanvienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlynhanvienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlynhanvienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
