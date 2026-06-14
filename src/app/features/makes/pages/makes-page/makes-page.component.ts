import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { ROUTES } from '@shared/consts/routes.constants';
import { MESSAGES } from '@shared/consts/i18n-messages';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { MakesStore } from '../../stores/makes.store';
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
  private readonly store = inject(MakesStore);
  private readonly router = inject(Router);

  protected readonly messages = MESSAGES.makes;
  protected readonly makesList = viewChild(MakesListComponent);
  protected readonly makes = this.store.filteredMakes;
  protected readonly loading = this.store.loading;
  protected readonly filter = this.store.filter;

  ngOnInit(): void {
    this.store.loadMakes();
  }

  onSearch(searchTerm: string): void {
    this.store.setFilter(searchTerm);
  }

  onSelect(makeId: number): void {
    this.router.navigate([ROUTES.MAKES_PATH, makeId]);
  }
}
