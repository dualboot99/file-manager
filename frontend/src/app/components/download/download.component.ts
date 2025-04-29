import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { LayoutComponent } from '../common/layout/layout.component';
import { DownloadFileDownloaderComponent } from './download-file-downloader/download-file-downloader.component';

@Component({
  selector: 'app-download',
  imports: [
    FormsModule,
    MatDivider,
    DownloadFileDownloaderComponent,
    LayoutComponent,
  ],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss',
})
export class DownloadComponent {}
