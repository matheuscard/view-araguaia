import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/Account/User';
import { UserUpdate } from '../models/Account/UserUpdate';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private currentUserSource = new ReplaySubject<User>(1);
    public currentUser$ = this.currentUserSource.asObservable();

    baseUrl = environment.apiAuth + 'api/account/';
    constructor(private http: HttpClient) { }

    public login(model: any): Observable<void>
    {
        return this.http.post<User>(this.baseUrl + 'login', model ).pipe(
            take(1),
            map((response:User) => {
                const user = response;
                if(user){
                    this.setCurrentUser(user);
                }
            })
        );
    }

    public logout(): void{
        localStorage.removeItem('user');
        this.currentUserSource.next(null);
        this.currentUserSource.complete();
    }
    public setCurrentUser(user: any): void{
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
    }
    public getUser():Observable<UserUpdate>{
        return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
    }
    public updateUser(model: UserUpdate):Observable<void>{
        return this.http.put<UserUpdate>(this.baseUrl + 'updateUser', model).pipe(take(1), map((user: UserUpdate) =>
        {
            this.setCurrentUser(user);
        }))
    }
    public register(model: any): Observable<void>
    {
        return this.http.post<User>(this.baseUrl + 'register', model ).pipe(
            take(1),
            map((response:User) => {
                const user = response;
                if(user){
                    this.setCurrentUser(user);
                }
            })
        );
    }
    public postUpload(userName: string, file: File): Observable<void>{
        const fileUpload =  file[0] as File;
        const formData = new FormData();
        formData.append('file', fileUpload);
        return this.http.post<User>(`${this.baseUrl}upload-image/${userName}`, formData).pipe(take(1), map((user: User) => {
            this.setCurrentUser(user);
        }));
    }
}
