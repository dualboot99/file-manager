import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileDataDTO } from '../models/FileDataDTO';
import { SavedFileDTO } from '../models/SavedFileDTO';
import { getBackendUrl } from '../utils/BackendUrl';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private backendUrl: string;
  constructor(private httpClient: HttpClient) {
    this.backendUrl = getBackendUrl();
  }

  uploadFile(file: File): Observable<HttpEvent<SavedFileDTO>> {
    const formData = new FormData();
    formData.append('file', file);
    const request = new HttpRequest(
      'POST',
      `${this.backendUrl}/v1/file`,
      formData,
      {
        reportProgress: true,
      }
    );
    return this.httpClient.request(request);
  }

  getFile(fileId: string): Observable<FileDataDTO> {
    return this.httpClient.get<FileDataDTO>(
      `${this.backendUrl}/v1/file/${fileId}`
    );
  }

  downloadFile(fileId: string): Observable<HttpEvent<any>> {
    const request = new HttpRequest(
      'GET',
      `${this.backendUrl}/v1/file/${fileId}/download`,
      {
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
      }
    );
    return this.httpClient.request(request);
  }
}
