import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/account/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserUrl = environment.resource_user_url + 'users/current';
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  token_url = environment.token_url;

  constructor(private httpClient: HttpClient) {

   }

   public getToken(code:string): Observable<any>{
    let body = new URLSearchParams();
    body.set('grant_type', environment.grant_type);
    body.set('client_id', environment.client_id);
    body.set('redirect_uri', environment.redirect_uri);
    body.set('scope', environment.scope);
    body.set('code_verifier', environment.code_verifier);
    body.set('code', code);
    const basic_auth = 'Basic '+ btoa('teste:teste');
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    const httpOptions = { headers: headers_object};
    return this.httpClient.post<any>(this.token_url, body, httpOptions);

   }
   public getAcessTokenByRefreshToken(refreshtoken:string):any{
    const basic_auth = 'Basic '+ btoa('teste:teste');
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    let body = new URLSearchParams();
    body.set('grant_type', environment.grant_type_refresh_token);
    body.set('refresh_token', refreshtoken);
    const httpOptions = { headers: headers_object};
    return this.httpClient.post<any>(this.token_url, body, httpOptions);

   }
   public getCurrentUser(): Observable<any>{
    const access_token = localStorage.getItem('access_token')!;
    const headers_object = new HttpHeaders({
      'Accept': '*/*',
      'Authorization': 'Bearer '+access_token
    });
    const httpOptions = { headers: headers_object};
    return this.httpClient.get<any>(this.currentUserUrl,httpOptions);
   

   }

   public setCurrentUser(user: any): void{
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
