import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { LayoutComponent } from '../common/layout/layout.component';
import { UploadFileUploaderComponent } from './upload-file-uploader/upload-file-uploader.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  imports: [MatDivider, UploadFileUploaderComponent, LayoutComponent],
})
export class UploadComponent {}
