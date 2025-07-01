import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinhsuaComponent } from './chinhsua.component';

describe('ChinhsuaComponent', () => {
  let component: ChinhsuaComponent;
  let fixture: ComponentFixture<ChinhsuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChinhsuaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChinhsuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
