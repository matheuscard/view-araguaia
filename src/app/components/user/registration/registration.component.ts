import { AbstractJsEmitterVisitor } from '@angular/compiler/src/output/abstract_js_emitter';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { ValidatorField } from 'src/app/helpers/ValidatorField';
import { User } from 'src/app/models/Account/User';
import { AccountService } from 'src/app/services/Account.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [MessageService]
})
export class RegistrationComponent implements OnInit {

    user = {} as User;

    form: FormGroup;

    get f():any{
        return this.form.controls;
    }
    constructor(public app: AppComponent,private fb:FormBuilder, private accountService: AccountService, private router: Router, private messageService: MessageService) {}

    valCheck: string[] = [];
    ngOnInit(): void {
        this.validation();
    }

    public validation(): void {

        const formOptions: AbstractControlOptions ={
            validators: ValidatorField.mustMatch('password','confirmPassword')
        }

        this.form = this.fb.group({
            firstName: ['',[Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
            lastName: ['',Validators.required],
            email: ['',[Validators.required, Validators.email]],
            userName: ['',Validators.required],
            password: ['',[Validators.required, Validators.minLength(4)]],
            confirmPassword: ['',[Validators.required, Validators.minLength(4)]],
        }, formOptions);
    }

    public register(): void{
        this.user = { ...this.form.value};
        this.accountService.register(this.user).subscribe(
            () => {this.router.navigateByUrl('/')},
            (error: any) => {this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error ao cadastrar usuario.', life: 3000});},
            () => {}
        )
    }
}
