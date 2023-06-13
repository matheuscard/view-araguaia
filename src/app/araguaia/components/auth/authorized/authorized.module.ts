import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizedRoutingModule } from './authorized-routing.module';
import { AuthorizedComponent } from './authorized.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';

@NgModule({
	imports: [
		CommonModule,
		AuthorizedRoutingModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        RippleModule,
        AppConfigModule
	],
	declarations: [AuthorizedComponent]
})
export class AuthorizedModule { }
