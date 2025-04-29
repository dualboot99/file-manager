import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject, output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../../../models/DialogData';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-download-file-dialog',
  imports: [MatButton, MatDialogContent, MatDialogActions],
  templateUrl: './download-file-dialog.component.html',
  styleUrl: './download-file-dialog.component.scss',
})
export class DownloadFileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DownloadFileDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  downloadFile = output<void>();

  closeDialog() {
    this.dialogRef.close();
  }

  download() {
    this.downloadFile.emit();
    this.closeDialog();
  }
}
