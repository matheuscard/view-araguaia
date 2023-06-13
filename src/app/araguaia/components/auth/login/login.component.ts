import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { environment } from 'src/environments/environment';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

	rememberMe: boolean = false;
	authorize_uri = environment.authorize_url;


	params: any = {
		client_id: environment.client_id,
		redirect_uri: environment.redirect_uri,
		scope: environment.scope,
		response_type: environment.response_type,
		response_mode: environment.response_mode,
		code_challenge_method: environment.code_challenge_method,
		code_challenge: environment.code_challenge
	}

	constructor(public layoutService: LayoutService, private router: Router) {}


	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

	ngOnInit(): void {
		throw new Error('Method not implemented.');
	}
	onLogin():void {
		const httpParams = new HttpParams({fromObject:this.params});
		const codeUrl = this.authorize_uri + httpParams.toString();
		location.href = codeUrl;
	}

}
