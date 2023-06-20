import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { User } from '../models/account/User';
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  constructor() { }
  setTokens(access_token: string, refresh_token: string): void
  {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, access_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
  }
  signOut(): void {
    localStorage.clear();
  }
  clear(): void{
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("user");
    this.currentUserSource.next(null!);
    this.currentUserSource.complete();
  }
  public saveToken(token: string): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, token);
  }
  public getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  public removeToken(): void {
     localStorage.removeItem(ACCESS_TOKEN);
  }
  public getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, token);
  }
}
