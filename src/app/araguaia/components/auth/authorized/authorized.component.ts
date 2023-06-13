import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dA } from '@fullcalendar/core/internal-common';
import { AuthService } from 'src/app/araguaia/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.scss']
})
export class AuthorizedComponent implements OnInit{
  code = '';
  constructor(private activateRoute: ActivatedRoute, 
    public layoutService: LayoutService,
    private authService: AuthService ){

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
        console.log(data);
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
