import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeDetailPageComponent } from './make-detail-page.component';

describe('MakeDetailPageComponent', () => {
  let component: MakeDetailPageComponent;
  let fixture: ComponentFixture<MakeDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
