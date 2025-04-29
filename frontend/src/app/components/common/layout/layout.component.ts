import { Component, input } from '@angular/core';
import { DescriptionCardComponent } from '../description-card/description-card.component';

@Component({
  selector: 'app-layout',
  imports: [DescriptionCardComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  leftCardTitle = input<string>();
  rightCardTitle = input<string>();
}
