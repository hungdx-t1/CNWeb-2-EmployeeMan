import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamcongComponent } from './chamcong.component';

describe('ChamcongComponent', () => {
  let component: ChamcongComponent;
  let fixture: ComponentFixture<ChamcongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChamcongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChamcongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
