import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  Component,
  computed,
  ElementRef,
  HostBinding,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { last, map, tap } from 'rxjs';
import { FileManagerService } from '../../../services/file-manager.service';
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { SavedFileDTO } from '../../../models/SavedFileDTO';
import { ENV } from '../../../utils/BackendUrl';

@Component({
  selector: 'app-upload-file-uploader',
  imports: [MatProgressSpinner],
  templateUrl: './upload-file-uploader.component.html',
  styleUrl: './upload-file-uploader.component.scss',
})
export class UploadFileUploaderComponent {
  fileUploadProgress = signal<number>(1);
  fileUploadProgressDescription = computed(() => {
    if (this.fileUploadProgress() > 1) {
      return `${this.fileUploadProgress()}%`;
    }
    return '0%';
  });
  fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  fileUploaded = signal<File | undefined>(undefined);
  fileUploadedId = signal<string | undefined>(undefined);
  fileUploadedError = signal<string | undefined>(undefined);

  @HostListener('click', ['$event'])
  onClick() {
    this.openFileInput();
  }

  constructor(
    private fileManagerService: FileManagerService,
    private dialog: MatDialog
  ) {}

  openFileInput() {
    if (this.fileUploaded() && this.fileUploadProgress() < 100) {
      return;
    }
    this.fileInput().nativeElement.click();
  }

  uploadFile() {
    const files = this.fileInput().nativeElement.files;
    if (files && files?.length > 0) {
      const file = files[0];
      this.fileUploaded.set(file);
      this.fileManagerService
        .uploadFile(file)
        .pipe(
          map((event) => this.getCurrentProgress(event)),
          tap((progress) => this.fileUploadProgress.set(progress)),
          last() // return last (completed) message to caller
        )
        .subscribe();
    }
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getCurrentProgress(event: HttpEvent<SavedFileDTO>): number {
    switch (event.type) {
      case HttpEventType.Sent:
        return 1;
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;
        return percentDone;
      case HttpEventType.Response: {
        if (event.ok) {
          if (this.fileManagerService.isProdEnv()) {
            this.fileManagerService
              .uploadToBrowserDB(this.fileUploaded()!)
              .subscribe((savedFile) => {
                this.fileUploadedId.set(savedFile.path);
                this.openDialog();
              });
          } else {
            this.fileUploadedId.set(event.body!.path);
            this.openDialog();
          }
        } else {
          this.fileUploadedError.set(
            `Failed to upload file due to a ${event.status} error`
          );
        }
        return 100;
      }
      default:
        return this.fileUploadProgress();
    }
  }

  private openDialog() {
    const activeElement = document.activeElement as HTMLElement; // Get the currently focused element
    activeElement.blur(); // Remove focus from the button
    this.dialog.open(UploadFileDialogComponent, {
      data: {
        fileName: this.fileUploaded()?.name,
        fileId: this.fileUploadedId(),
      },
      disableClose: true,
      autoFocus: false,
    });
  }
}
