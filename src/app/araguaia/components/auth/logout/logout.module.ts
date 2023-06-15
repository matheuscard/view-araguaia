import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { LogoutComponent } from './logout.component';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
	imports: [
		CommonModule,
		LogoutRoutingModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        AppConfigModule
	],
	declarations: [LogoutComponent]
})
export class LogoutModule { }
