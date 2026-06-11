import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
  });

  it('creates with default empty value', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component['control'].value).toBe('');
  });

  it('initializes control with the initialValue input', () => {
    fixture.componentRef.setInput('initialValue', 'toyota');
    fixture.detectChanges();
    expect(component['control'].value).toBe('toyota');
  });

  it('emits search after debounce when control value changes', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.search.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('honda');
    tick(250);

    expect(emitted).toEqual(['honda']);
  }));

  it('does not emit before debounce time elapses', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.search.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('ho');
    tick(100);

    expect(emitted).toEqual([]);
    tick(150);
  }));

  it('emits only the last value within the debounce window', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.search.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('h');
    tick(100);
    component['control'].setValue('ho');
    tick(100);
    component['control'].setValue('hon');
    tick(250);

    expect(emitted).toEqual(['hon']);
  }));

  it('does not emit the same value twice in a row (distinctUntilChanged)', fakeAsync(() => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.search.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('toyota');
    tick(250);
    component['control'].setValue('toyota');
    tick(250);

    expect(emitted).toEqual(['toyota']);
  }));
});
