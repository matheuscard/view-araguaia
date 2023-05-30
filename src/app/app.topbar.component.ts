import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import { User } from './models/Account/User';
import { AccountService } from './services/Account.service';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-left">
                <a href="#" class="topbar-menu-button" (click)="appMain.onMenuButtonClick($event)" *ngIf="appMain.isOverlay() || appMain.isMobile()">
                    <i class="pi pi-bars"></i>
                </a>

                <!-- <a href="#" class="logo">
                    <img  [src]="'assets/layout/images/logo-'+ (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'">
                </a>

                <a href="#">
                    <img  [src]="'assets/layout/images/appname-'+ (app.colorScheme === 'light' ? 'dark' : 'light') + '.png'" class="app-name"/>
                </a> -->
            </div>

            <app-menu></app-menu>

            <div class="layout-topbar-right">
                <ul class="layout-topbar-right-items">
                    <li *ngIf="(getUser() | async) as user" #profile class="profile-item" [ngClass]="{'active-topmenuitem':appMain.activeTopbarItem === profile}">
                        <a href="#" (click)="appMain.onTopbarItemClick($event,profile)">
                            <img src="https://localhost:7027/resources/images/{{user.imagemURL}}" style="border-radius:50px">
                        </a>

                        <ul class="fadeInDown">
                            <li role="menuitem">
                                <a routerLink="user/perfil" (click)="appMain.onTopbarSubItemClick($event)">
                                    <i class="pi pi-fw pi-user"></i>
                                    <span>Perfil</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                    <i class="pi pi-fw pi-cog"></i>
                                    <span>Configurações</span>
                                </a>
                            </li>
                            <li role="menuitem">
                                <a href="#" (click)="logout()">
                                    <i class="pi pi-fw pi-sign-out"></i>
                                    <span>Sair</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">
                            <i class="topbar-icon pi pi-fw pi-bell"></i>
                            <span class="topbar-badge">2</span>
                            <span class="topbar-item-name">Notificações</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i class="topbar-icon pi pi-fw pi-comment"></i>
                            <span class="topbar-badge">5</span>
                            <span class="topbar-item-name">Mensagens</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class AppTopbarComponent {

    constructor(public app: AppComponent, public appMain: AppMainComponent, private accountService: AccountService, private router: Router) {}
    public logout():void{
        this.accountService.logout()
        this.router.navigateByUrl('/user/login').then(() => {
            window.location.reload();
          });

    }

    public getUser(): any{
        return this.accountService.currentUser$;
    }
}
