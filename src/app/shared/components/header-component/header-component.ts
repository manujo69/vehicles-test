import { Component } from '@angular/core';
import { MESSAGES } from '../../consts/i18n-messages';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  protected readonly messages = MESSAGES.app;
}
