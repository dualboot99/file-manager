import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-upload-description',
  imports: [MatDivider, MatCard, MatCardContent],
  templateUrl: './upload-description.component.html',
  styleUrl: './upload-description.component.scss',
})
export class UploadDescriptionComponent {}
