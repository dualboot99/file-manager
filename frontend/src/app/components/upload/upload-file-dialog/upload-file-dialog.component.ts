import { Component, inject, input, output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DialogData } from '../../../models/DialogData';

@Component({
  selector: 'app-upload-file-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatIconButton,
    MatIcon,
    ClipboardModule,
  ],
  templateUrl: './upload-file-dialog.component.html',
  styleUrl: './upload-file-dialog.component.scss',
})
export class UploadFileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<UploadFileDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close();
  }
}
