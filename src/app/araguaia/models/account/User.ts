export class User {
    login?: string;
    acessToken?:string;
    refreshToken?:string;
    constructor(login: string, acessToken: string, refreshToken: string){
		this.login = login;
		this.acessToken = acessToken;
		this.refreshToken = refreshToken;
	}
}