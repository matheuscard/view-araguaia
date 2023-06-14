import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/araguaia/models/account/User';
import { AuthService } from 'src/app/araguaia/service/auth.service';
import { TokenService } from 'src/app/araguaia/service/token.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss']
})
export class AuthorizedComponent implements OnInit{
  code = '';  
  constructor(private activateRoute: ActivatedRoute, 
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService){

  }
  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(data => {
      this.code = data['code'];
      this.getToken();
      

    })
    
    console.log(btoa('teste:teste'))
  }
  getToken():void{
    this.authService.getToken(this.code).subscribe(
      data => {
        this.tokenService.setTokens(data.access_token, data.refresh_token);
        this.authService.getCurrentUser().subscribe((data:User)=>{
          const access_token = localStorage.getItem('access_token')!;
          const refresh_token = localStorage.getItem('refresh_token')!;
          const login = data.login;
          if(login){
            let u = new User(login,access_token,refresh_token)
            this.authService.setCurrentUser(u);
            this.router.navigateByUrl('');
          }
        },
        err=>{
          console.log(err);
        }
      );
      },
      err=>{
        console.log(err);
      }
    )
   
  }
  get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}


}
