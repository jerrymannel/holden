import { HttpHandler, HttpRequest, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CommonService } from './common.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService {

  constructor(
    private commonservice: CommonService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 401) {
            console.error('Error intercepted');
          }
        }
        return event;
      }))
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('Session not valid. Relogin.');
          this.commonservice.logout();
        }
        return throwError(error);
      })
      );
  }
}
