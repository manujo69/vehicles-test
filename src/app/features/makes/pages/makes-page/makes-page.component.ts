import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { makesFeature } from '../../stores/makes-features';
import { makesActions } from '../../stores/makes-actions';
import { MakesListComponent } from '../../components/makes-list.component/makes-list.component';
import { SearchBoxComponent } from '../../components/search-box.component/search-box.component';

@Component({
  selector: 'app-makes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, MakesListComponent, SearchBoxComponent, MatButtonModule, MatIconModule],
  templateUrl: './makes-page.component.html',
  styleUrls: ['./makes-page.component.scss'],
})
export class MakesPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly makesList = viewChild(MakesListComponent);
  protected readonly makes = this.store.selectSignal(makesFeature.selectFilteredMakes);
  protected readonly loading = this.store.selectSignal(makesFeature.selectLoading);
  protected readonly filter = this.store.selectSignal(makesFeature.selectFilter);

  ngOnInit(): void {
    this.store.dispatch(makesActions.loadMakes());
  }

  onSearch(searchTerm: string): void {
    this.store.dispatch(makesActions.setFilter({ searchTerm }));
  }

  onSelect(makeId: number): void {
    this.router.navigate(['/makes', makeId]);
  }
}
