import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakesPageComponent } from './makes-page.component';

describe('MakesPageComponent', () => {
  let component: MakesPageComponent;
  let fixture: ComponentFixture<MakesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
