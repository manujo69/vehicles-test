import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SearchBoxComponent } from './search-box.component';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBoxComponent],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
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

  it('emits search after debounce when control value changes', async () => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.searched.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('honda');
    await wait(300);

    expect(emitted).toEqual(['honda']);
  });

  it('does not emit before debounce time elapses', async () => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.searched.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('ho');
    await wait(100);

    expect(emitted).toEqual([]);
    await wait(200); // let timer complete to avoid leaking into next test
  });

  it('emits only the last value within the debounce window', async () => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.searched.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('h');
    await wait(100);
    component['control'].setValue('ho');
    await wait(100);
    component['control'].setValue('hon');
    await wait(300);

    expect(emitted).toEqual(['hon']);
  });

  it('does not emit the same value twice in a row (distinctUntilChanged)', async () => {
    fixture.detectChanges();
    const emitted: string[] = [];
    component.searched.subscribe((term: string) => emitted.push(term));

    component['control'].setValue('toyota');
    await wait(300);
    component['control'].setValue('toyota');
    await wait(300);

    expect(emitted).toEqual(['toyota']);
  });
});
