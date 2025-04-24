import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarRoute } from '../../../utils/NavbarRoute';

@Component({
  selector: 'app-navbar-buttons',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar-buttons.component.html',
  styleUrl: './navbar-buttons.component.scss',
})
export class NavbarButtonsComponent {
  activeRoute = input.required<NavbarRoute>();
  goTo = output<NavbarRoute>();

  updateActiveRoute(newActiveRoute: NavbarRoute) {
    this.goTo.emit(newActiveRoute);
  }
}
