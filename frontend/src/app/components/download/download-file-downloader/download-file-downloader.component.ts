import { Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FileManagerService } from '../../../services/file-manager.service';
import { FileDataDTO } from '../../../models/FileDataDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DownloadFileDialogComponent } from '../download-file-dialog/download-file-dialog.component';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { last, map, tap } from 'rxjs';
import {
  downloadBlob,
  getFileNameFromContentDispositionHeader,
  handlingResponse,
} from '../../../utils/FileDownloadAsBlob';

@Component({
  selector: 'app-download-file-downloader',
  imports: [
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    ReactiveFormsModule,
  ],
  templateUrl: './download-file-downloader.component.html',
  styleUrl: './download-file-downloader.component.scss',
})
export class DownloadFileDownloaderComponent {
  fileDownloaded = signal<FileDataDTO | null>(null);
  fileDownloadProgress = signal<number>(0);
  fileDownloadProgressDescription = computed(() => {
    return `${this.fileDownloadProgress()}%`;
  });
  loadingFile = signal<boolean>(false);

  readonly fileId = new FormControl('', [
    Validators.pattern("^[a-zA-Z0-9-']+"),
  ]);

  errorMessage = signal('');

  private fileIdToDownload = signal<string>('');

  constructor(
    private fileManagerService: FileManagerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  updateErrorMessage() {
    if (this.fileId.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.fileId.hasError('pattern')) {
      this.errorMessage.set('You must enter a valid file identifier');
    } else {
      this.errorMessage.set('');
    }
  }

  getFile() {
    this.snackBar.dismiss();
    this.loadingFile.set(true);
    this.fileId.disable();
    this.fileIdToDownload.set(this.fileId.value!);
    this.fileManagerService.getFile(this.fileIdToDownload()).subscribe({
      next: (data: FileDataDTO) => {
        const dialogRef = this.dialog.open(DownloadFileDialogComponent, {
          data: { fileName: data.name, fileId: this.fileIdToDownload() },
          disableClose: true,
          autoFocus: false,
        });
        dialogRef.componentInstance.downloadFile.subscribe(() => {
          this.fileDownloaded.set(data);
          this.downloadFile(this.fileIdToDownload());
        });
        dialogRef.afterClosed().subscribe(() => {
          this.fileId.enable();
          this.loadingFile.set(false);
        });
      },
      error: () => {
        this.snackBar.open('Failed to get file', 'Close', {
          duration: 3000,
        });
        this.fileId.enable();
        this.loadingFile.set(false);
      },
    });
  }

  reset() {
    this.fileId.setValue('');
    this.fileDownloaded.set(null);
    this.fileId.enable();
    this.loadingFile.set(false);
  }

  private downloadFile(fileId: string) {
    this.fileManagerService
      .downloadFile(fileId)
      .pipe(
        map((event) => this.getCurrentProgress(event as HttpEvent<Blob>)),
        tap((progress) => this.fileDownloadProgress.set(progress)),
        last() // return last (completed) message to caller
      )
      .subscribe({
        error: (error) => {
          console.error('Error happened: ', error);
        },
      });
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getCurrentProgress(event: HttpEvent<any>): number {
    switch (event.type) {
      case HttpEventType.Sent:
        return 1;
      case HttpEventType.DownloadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;
        return percentDone;
      case HttpEventType.Response: {
        if (event.status === 200) {
          if (this.fileManagerService.isProdEnv()) {
            this.fileManagerService
              .downloadFromBrowserDB(this.fileIdToDownload())
              .subscribe((data) => {
                downloadBlob(data, this.fileDownloaded()!.name);
              });
          } else {
            handlingResponse(
              event.body,
              getFileNameFromContentDispositionHeader(
                event.headers.get('Content-Disposition') ?? ''
              )
            );
          }
        } else {
          this.snackBar.open(
            `Failed to upload file due to a ${event.status} error`,
            'Close',
            {
              duration: 3000,
            }
          );
        }
        return 100;
      }
      default:
        return this.fileDownloadProgress();
    }
  }
}
