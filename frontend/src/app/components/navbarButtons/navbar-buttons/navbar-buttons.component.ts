import {
  Component,
  HostListener,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
export class NavbarButtonsComponent implements OnInit {
  activeRoute = input.required<NavbarRoute>();
  goTo = output<NavbarRoute>();
  smallScreen = signal<boolean>(false);

  ngOnInit() {
    this.evalWindowWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.evalWindowWidth();
  }

  updateActiveRoute(newActiveRoute: NavbarRoute) {
    this.goTo.emit(newActiveRoute);
  }

  private evalWindowWidth() {
    this.smallScreen.set(window.innerWidth < 600);
  }
}
