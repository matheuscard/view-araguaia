import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { AccountService } from './services/Account.service';

@Component({
    selector: 'app-rightmenu',
    templateUrl: './app.rightmenu.component.html'
})
export class AppRightMenuComponent {
    date: Date;

    constructor(public appMain: AppMainComponent,  public accountService: AccountService) {}
}
