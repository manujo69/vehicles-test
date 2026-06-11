import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Make } from '@domain/make.model';
import { MESSAGES } from '@shared/consts/i18n-messages';

@Component({
  selector: 'app-makes-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, MatIconModule, MatButtonModule],
  templateUrl: './makes-list.component.html',
  styleUrls: ['./makes-list.component.scss'],
})
export class MakesListComponent {
  makes = input.required<Make[]>();
  selected = output<number>();

  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  protected readonly messages = MESSAGES.makes;
  protected trackById = (_: number, make: Make) => make.id;

  scrollUp(): void {
    const vp = this.viewport();
    if (!vp) return;
    vp.scrollToOffset(Math.max(0, vp.measureScrollOffset() - vp.getViewportSize()), 'smooth');
  }

  scrollDown(): void {
    const vp = this.viewport();
    if (!vp) return;
    vp.scrollToOffset(vp.measureScrollOffset() + vp.getViewportSize(), 'smooth');
  }
}
