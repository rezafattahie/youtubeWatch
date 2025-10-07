import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private baseUrl = '/api/data';

  public loading = signal(false);
  public error = signal<string | null>(null);

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Error occured';
    if (error.error instanceof ErrorEvent) {
      message = `Client Eerror: ${error.error.message}`;
    } else {
      message = error.error.message;
    }
    this.error.set(message);
    return throwError(() => new Error(message));
  }

  get<T>(endpoint: string, params?: any) {
    this.loading.set(true);
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
        params,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  post<T>(endpoint: string, body: any) {
    this.loading.set(true);
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  put<T>(endpoint: string, body: any) {
    this.loading.set(true);
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  delete<T>(endpoint: string) {
    this.loading.set(true);
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  resetError() {
    this.error.set(null);
  }

  resetLoading() {
    this.loading.set(false);
  }
}
