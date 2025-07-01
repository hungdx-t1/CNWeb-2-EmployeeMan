import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosoxinviecComponent } from './hosoxinviec.component';

describe('HosoxinviecComponent', () => {
  let component: HosoxinviecComponent;
  let fixture: ComponentFixture<HosoxinviecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HosoxinviecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HosoxinviecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
