import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhanquyenComponent } from './phanquyen.component';

describe('PhanquyenComponent', () => {
  let component: PhanquyenComponent;
  let fixture: ComponentFixture<PhanquyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhanquyenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhanquyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
