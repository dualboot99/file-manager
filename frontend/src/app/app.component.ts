import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarButtonsComponent } from './components/navbarButtons/navbar-buttons/navbar-buttons.component';
import { NavbarRoute } from './utils/NavbarRoute';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NavbarButtonsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  activeRoute = signal<NavbarRoute>('upload');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute.set(
          event.urlAfterRedirects.split('/')[1] as NavbarRoute
        );
      });
  }

  goTo(newRoute: NavbarRoute) {
    this.router.navigate(['/', newRoute]);
    this.activeRoute.set(newRoute);
  }
}
