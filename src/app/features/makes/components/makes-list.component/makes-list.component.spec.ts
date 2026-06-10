import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakesListComponent } from './makes-list.component';

describe('MakesListComponent', () => {
  let component: MakesListComponent;
  let fixture: ComponentFixture<MakesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
