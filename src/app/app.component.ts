import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { User } from './models/Account/User';
import { AccountService } from './services/Account.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

    menuMode = 'static';

    layout = 'blue';

    theme = 'blue';

    ripple: boolean;

    colorScheme = 'light';
    user: User;
    constructor(private primengConfig: PrimeNGConfig, public accountService: AccountService, private router: Router) {
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;
        this.setCurrentUser();
    }
    setCurrentUser():void{

        if(localStorage.getItem('user'))
            this.user = JSON.parse(localStorage.getItem('user') ?? '{}')
        else
            this.user = null;

        if(this.user)
            this.accountService.setCurrentUser(this.user);
    }
}
