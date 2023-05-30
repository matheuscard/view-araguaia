import { Component, OnInit } from "@angular/core";
import {
    AbstractControlOptions,
    FormBuilder,
    FormGroup,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { ValidatorField } from "src/app/helpers/ValidatorField";
import { UserUpdate } from "src/app/models/Account/UserUpdate";
import { AccountService } from "src/app/services/Account.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-perfil",
    templateUrl: "./perfil.component.html",
    styleUrls: ["./perfil.component.scss"]
})
export class PerfilComponent implements OnInit {

    userUpdate = {} as UserUpdate;

    form: FormGroup;

    file:File;

    imagemURL: string = "../../../../assets/layout/images/upload_icon.png";

    get f(): any {
        return this.form.controls;
    }
    constructor(
        private breadcrumbService: AppBreadcrumbService,
        private fb: FormBuilder,
        public accountService: AccountService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.breadcrumbService.setItems([
            { label: "Meu Perfil", routerLink: ["/perfil"] },
        ]);
    }
    valCheck: string[] = [];
    ngOnInit() {
        this.validation();
        this.loadUser();
    }

    private loadUser():void
    {
        this.accountService.getUser().subscribe(
            (userRetorno: UserUpdate)=>{
                console.log(userRetorno)
                this.userUpdate = userRetorno;
                this.form.patchValue(this.userUpdate);
                if(this.userUpdate.imagemURL !== '')
                {
                    this.imagemURL = environment.apiURL +'resources/images/'+this.userUpdate.imagemURL;
                }else{
                    this.imagemURL = '../../../../assets/layout/images/upload_icon.png'
                }
                this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Usuario carregado', life: 3000});
            },
            (error)=>{
                console.error(error);
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Usuario nao carregado', life: 3000});
                this.router.navigate(['/'])

            }
        );
    }

    public validation(): void {
        const formOptions: AbstractControlOptions = {
            validators: ValidatorField.mustMatch("password", "confirmPassword"),
        };

        this.form = this.fb.group(
            {
                firstName: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(50),
                    ],
                ],
                lastName: ["", Validators.required],
                email: ["", [Validators.required, Validators.email]],
                descricao:['',Validators.minLength(2)],
                funcao:['NaoInformado'],
                titulo:['NaoInformado'],
                userName: [''],
                currentPassword: [
                    "123456",
                    [Validators.required, Validators.minLength(6)],
                ],
                password: ["", [Validators.required, Validators.minLength(6)]],
                confirmPassword: [
                    "",
                    [Validators.required, Validators.minLength(6)],
                ],
            },
            formOptions
        );
    }

    public resetForm(event:any): void {
        event.preventDefault()
        this.form.reset();
    }
    public onSubmit():void{
        this.atualizarUsuario();
    }

    public atualizarUsuario(){
        this.userUpdate = { imagemURL: this.userUpdate.imagemURL, ...this.form.value}
        console.log(this.imagemURL);
        this.accountService.updateUser(this.userUpdate).subscribe(
            () =>  this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Usuario atualizado', life: 3000}),
            (error) => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: error.error, life: 3000});
                console.error(error);
            }
        )
    }

    onFileChange(ev: any): void{
        const reader = new FileReader();
        reader.onload = (event: any) => this.imagemURL = event.target.result;
        this.file = ev.target.files;
        reader.readAsDataURL(this.file[0]);
        this.uploadImagem();
    }
    uploadImagem():void{
        this.accountService.postUpload(this.userUpdate.userName, this.file).subscribe(
            () =>{
                this.loadUser();
                this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Imagem do usuário salva.', life: 3000});},
            (error: any) =>{ this.messageService.add({severity: 'error', summary: 'Error', detail: 'Erro ao salvar imagem do usuário.', life: 3000});
            console.error(error);}
        )
    }
}
