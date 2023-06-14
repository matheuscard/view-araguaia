import { Injectable } from "@angular/core";
import {
    CanActivate,
    Router
} from "@angular/router";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private messageService: MessageService)
    {

    }

    canActivate(): boolean {
        if(localStorage.getItem('user') != null)
            return true;
        this.messageService.add({severity: 'error', summary: 'Atenção', detail: 'Você precisa logar-se para acessar este conteúdo.', life: 3000});
        this.router.navigate(['/access']);
        return false;
    }
}
