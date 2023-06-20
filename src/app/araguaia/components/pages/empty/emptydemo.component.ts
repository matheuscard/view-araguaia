import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/araguaia/models/account/User';
import { AuthService } from 'src/app/araguaia/service/auth.service';

@Component({
    templateUrl: './emptydemo.component.html'
})
export class EmptyDemoComponent implements OnInit{ 
    username = '';  
    constructor(private authService: AuthService){
        
    }
    ngOnInit(): void {
        this.authService.getCurrentUser().subscribe((data:User)=>{
            const access_token = localStorage.getItem('access_token')!;
            const refresh_token = localStorage.getItem('refresh_token')!;
            const login = data.login;
            if(login){
                this.username= login;
              let u = new User(login,access_token,refresh_token)
              this.authService.setCurrentUser(u);
            }
          },
          err=>{
            console.log(err);
          }
        );
    }
}
