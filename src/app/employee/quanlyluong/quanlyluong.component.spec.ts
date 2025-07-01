import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanlyluongComponent } from './quanlyluong.component';

describe('QuanlyluongComponent', () => {
  let component: QuanlyluongComponent;
  let fixture: ComponentFixture<QuanlyluongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuanlyluongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuanlyluongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
