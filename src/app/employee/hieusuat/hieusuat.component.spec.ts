import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HieusuatComponent } from './hieusuat.component';

describe('HieusuatComponent', () => {
  let component: HieusuatComponent;
  let fixture: ComponentFixture<HieusuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HieusuatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HieusuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
