import { Component, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';

export interface UploadFileDialogData {
  fileName: string;
  fileId: string;
}

@Component({
  selector: 'app-upload-file-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatIcon,
    ClipboardModule,
  ],
  templateUrl: './upload-file-dialog.component.html',
  styleUrl: './upload-file-dialog.component.scss',
})
export class UploadFileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UploadFileDialogComponent>);
  readonly data = inject<UploadFileDialogData>(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close();
  }
}
