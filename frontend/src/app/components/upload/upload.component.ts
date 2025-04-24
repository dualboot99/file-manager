import { Component } from '@angular/core';
import { UploadFileUploaderComponent } from './upload-file-uploader/upload-file-uploader.component';
import { UploadDescriptionComponent } from './upload-description/upload-description.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  imports: [UploadFileUploaderComponent, UploadDescriptionComponent],
})
export class UploadComponent {}
