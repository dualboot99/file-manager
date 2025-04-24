import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest(
      'POST',
      'http://localhost:8080/file-manager/api/v1/file',
      formData,
      {
        reportProgress: true,
      }
    );
    return this.httpClient.request(request);
  }
}
