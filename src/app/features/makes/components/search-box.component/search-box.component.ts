// features/makes/components/search-box/search-box.component.ts
import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-box',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './search-box.component.html',
  styles: `
    .field { width: 100%; }
  `,
})
export class SearchBoxComponent implements OnInit {
  initialValue = input('');
  search = output<string>();
  protected readonly control = new FormControl('', { nonNullable: true });

  constructor() {
    this.control.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.search.emit(term));
  }

  ngOnInit(): void {
    this.control.setValue(this.initialValue(), { emitEvent: false });
  }
}
