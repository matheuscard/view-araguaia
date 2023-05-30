import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AccountService } from './services/Account.service';
import { Router } from '@angular/router';
import { User } from './models/Account/User';
import { UserUpdate } from './models/Account/UserUpdate';
import { environment } from "src/environments/environment";

import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-inlinemenu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('inline', [
            state('hidden', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visible', style({
                height: '*',
            })),
            state('hiddenAnimated', style({
                height: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppInlineMenuComponent {
    constructor(public appMain: AppMainComponent, private accountService: AccountService, private router: Router,
        private messageService: MessageService) {}
    userUpdate = {} as UserUpdate;
    imagemURL = environment.apiURL +'resources/images/';
    ngOnInit() {
        console.log(environment)
    }
    public logout():void{
        this.accountService.logout()
        this.router.navigateByUrl('/user/login').then(() => {
            window.location.reload();
          });

    }

}
