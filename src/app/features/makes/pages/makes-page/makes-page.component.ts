import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ROUTES } from '@shared/consts/routes.constants';
import { MESSAGES } from '@shared/consts/i18n-messages';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import { MakesListComponent } from '../../components/makes-list.component/makes-list.component';
import { SearchBoxComponent } from '../../components/search-box.component/search-box.component';
import { MakesStateService } from '../../services/makes-state.service';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-makes-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingSpinnerComponent, MakesListComponent, SearchBoxComponent, MatButtonModule, MatIconModule],
  templateUrl: './makes-page.component.html',
  styleUrls: ['./makes-page.component.scss'],
})
export class MakesPageComponent {
  private readonly state = inject(MakesStateService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly messages = MESSAGES.makes;
  protected readonly makesList = viewChild(MakesListComponent);
  protected readonly filter = signal('');

  protected readonly loading = this.state.loading;
  protected readonly makes = computed(() => {
    const all = this.state.makes();
    const term = this.filter().trim().toLowerCase();
    return term ? all.filter(m => m.name.toLowerCase().includes(term)) : all;
  });

  constructor() {
    this.state.load();
    effect(() => {
      const error = this.state.error();
      if (error) this.notifications.error(error.message);
    });
  }

  onSearch(searchTerm: string): void {
    this.filter.set(searchTerm);
  }

  onSelect(makeId: number): void {
    this.router.navigate([ROUTES.MAKES_PATH, makeId]);
  }
}
