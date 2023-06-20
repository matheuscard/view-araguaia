import { Injectable } from '@angular/core';
import {HTTP_INTERCEPTORS,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';

const TOKEN_HEADER_KEY = 'Authorization'; 
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenService, private authService : AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    
    let authReq = req;
    const token = this.tokenService.getToken();
    if(token!=null){
      console.log("Token existe?")
      console.log(token)
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      console.log("Erro:")
      console.log(error)
      if(error instanceof HttpErrorResponse && !authReq.url.includes('auth/login') &&  error.status === 401){
        this.tokenService.removeToken();
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<Object>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();
      console.log("refrescando o token")
      if (token)
        return this.authService.getAcessTokenByRefreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            
            this.tokenService.saveToken(token.access_token);
            this.refreshTokenSubject.next(token.refresh_token);
            console.log("token refrescado:");
            console.log(token);
            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            
            this.tokenService.signOut();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer '+ token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];