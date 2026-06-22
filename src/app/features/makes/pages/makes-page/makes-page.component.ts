import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VpicApiService } from '@core/api/vpic-api.service';
import { NotificationService } from '@shared/services/notification.service';
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
export class MakesPageComponent {
  private readonly api = inject(VpicApiService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  protected readonly messages = MESSAGES.makes;
  protected readonly makesList = viewChild(MakesListComponent);
  protected readonly filter = signal('');

  protected readonly makesQuery = injectQuery(() => ({
    queryKey: ['makes'],
    queryFn: () => firstValueFrom(this.api.getAllMakes()),
  }));

  protected readonly loading = computed(() => this.makesQuery.isPending());

  protected readonly makes = computed(() => {
    const data = this.makesQuery.data() ?? [];
    const term = this.filter().trim().toLowerCase();
    return term ? data.filter(m => m.name.toLowerCase().includes(term)) : data;
  });

  constructor() {
    effect(() => {
      const error = this.makesQuery.error();
      if (error) this.notifications.error((error as Error).message);
    });
  }

  onSearch(searchTerm: string): void {
    this.filter.set(searchTerm);
  }

  onSelect(makeId: number): void {
    this.router.navigate([ROUTES.MAKES_PATH, makeId]);
  }
}
