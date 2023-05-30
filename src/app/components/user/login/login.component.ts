import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AppComponent } from "src/app/app.component";
import { User } from "src/app/models/Account/User";
import { UserLogin } from "src/app/models/Account/UserLogin";
import { AccountService } from "src/app/services/Account.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
    model = {} as UserLogin;
    constructor(public app: AppComponent, private accountService: AccountService, private router: Router, private messageService: MessageService) {}
    ngOnInit(): void {

    }

    public login(): void{
        this.accountService.login(this.model).subscribe(
            () => {
                this.router.navigateByUrl('/user/select-company')
            },
            (error: any) => {
                if(error.status == 401)
                    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Usuario ou Senha invalida', life: 3000});
                else
                    console.error(error);
            },
            () => {}
        );
    }
}
