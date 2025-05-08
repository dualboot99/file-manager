import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { Observable, Subject } from 'rxjs';
import { FileDataDTO } from '../models/FileDataDTO';
import { SavedFileDTO } from '../models/SavedFileDTO';
import { ENV, getBackendUrl, getEnv } from '../utils/BackendUrl';
import { DB_NAME, DB_VERSION, STORE_NAME } from '../utils/DBData';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private env: ENV;
  private backendUrl: string;
  private db: IDBPDatabase | undefined;
  constructor(private httpClient: HttpClient) {
    this.env = getEnv();
    this.backendUrl = getBackendUrl(this.env);

    if (this.isProdEnv()) {
      this.initDBConnection();
    }
  }

  isProdEnv() {
    return this.env === ENV.PROD;
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
    if (this.isProdEnv()) {
      return this.mockGetFile(fileId);
    }
    return this.httpClient.get<FileDataDTO>(
      `${this.backendUrl}/v1/file/${fileId}`
    );
  }

  downloadFile(fileId: string): Observable<HttpEvent<Blob>> {
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

  uploadToBrowserDB(file: File): Observable<SavedFileDTO> {
    const savedFile$ = new Subject<SavedFileDTO>();
    const fileId = Date.now().toString();
    this.db?.put(STORE_NAME, file, fileId).then(() => {
      savedFile$.next({ path: fileId });
    });
    return savedFile$;
  }

  downloadFromBrowserDB(fileId: string): Observable<Blob> {
    const fileData$ = new Subject<Blob>();

    this.db?.get(STORE_NAME, fileId).then(async (file) => {
      await this.db?.delete(STORE_NAME, fileId);
      fileData$.next(file);
    });

    return fileData$;
  }

  private initDBConnection(): void {
    openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    }).then((db) => (this.db = db));
  }

  private mockGetFile(fileId: string): Observable<FileDataDTO> {
    const file$ = new Subject<FileDataDTO>();
    this.db?.get(STORE_NAME, fileId).then((file) => {
      if (!file) {
        file$.error('File not found');
      } else {
        file$.next({ name: file.name });
      }
    });
    return file$;
  }
}
