import { ChangeDetectionStrategy, Component, inject, OnInit, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MakesPort } from '../../data/makes.port';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { MakesListComponent } from '../../components/makes-list.component/makes-list.component';
import { SearchBoxComponent } from '../../components/search-box.component/search-box.component';
import { ROUTES } from '@shared/consts/routes.constants';
import { MESSAGES } from '@shared/consts/i18n-messages';

@Component({
  selector: 'app-makes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, MakesListComponent, SearchBoxComponent, MatButtonModule, MatIconModule],
  templateUrl: './makes-page.component.html',
  styleUrls: ['./makes-page.component.scss'],
})
export class MakesPageComponent implements OnInit {
  private readonly port = inject(MakesPort);
  private readonly router = inject(Router);

  protected readonly messages = MESSAGES.makes;
  protected readonly makesList = viewChild(MakesListComponent);
  protected readonly makes = this.port.makes;
  protected readonly loading = this.port.loading;
  protected readonly filter = this.port.filter;

  ngOnInit(): void {
    this.port.loadMakes();
  }

  onSearch(searchTerm: string): void {
    this.port.setFilter(searchTerm);
  }

  onSelect(makeId: number): void {
    this.router.navigate([ROUTES.MAKES_PATH, makeId]);
  }
}
