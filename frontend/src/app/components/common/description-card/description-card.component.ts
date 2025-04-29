import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-description',
  imports: [CommonModule, MatCard, MatCardContent],
  templateUrl: './description-card.component.html',
  styleUrl: './description-card.component.scss',
})
export class DescriptionCardComponent {
  title = input<string>();
}
