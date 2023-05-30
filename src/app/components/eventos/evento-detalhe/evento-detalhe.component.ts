import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { Evento } from "src/app/models/Evento";
import { Lote } from "src/app/models/Lote";
import { ActivatedRoute, Router } from "@angular/router";
import { EventoService } from "src/app/services/Evento.service";
import { ConfirmationService, MenuItem, MessageService } from "primeng/api";
import { LoteService } from "src/app/services/Lote.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-evento-detalhe",
    templateUrl: "./evento-detalhe.component.html",
    styleUrls: ["./evento-detalhe.component.scss"],
})
export class EventoDetalheComponent implements OnInit {
    eventoId: number;
    evento = {} as Evento;
    cardMenu: MenuItem[];
    form: FormGroup;
    loteAtual = {id:0, nome: '', indice:0};
    file:File;
    imagemURL: string = "../../../../assets/layout/images/upload_icon.png";
    get lotes(): FormArray{
        return this.form.get('lotes') as FormArray;
    }

    get f():any{
        return this.form.controls;
    }
    get modoEditar():boolean{
        return this.router.snapshot.paramMap.get('id') !=null;
    }

    constructor(
        private breadcrumbService: AppBreadcrumbService,
        private fb:FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: ActivatedRoute,
        private routerNavigate: Router,
        private eventoService: EventoService,
        private loteService: LoteService,
        private cdr: ChangeDetectorRef
    ) {
        this.breadcrumbService.setItems([
            { label: "Eventos", routerLink: ["/eventos"] },
            { label: "Detalhes", routerLink: ["/eventos/detalhe"] },
        ]);
    }
    ngAfterViewChecked(){
        //your code to update the model
        this.cdr.detectChanges();
        console.log("Evento: "+this.evento.dataEvento);
        console.log("Form: "+this.form.controls.dataEvento.value);
     }
    public loadEvento():void{
        this.eventoId = +this.router.snapshot.paramMap.get('id');
        if(this.eventoId !== null && this.eventoId !== 0){
            this.eventoService.getEventosById(this.eventoId).subscribe({
                next: (evento:Evento)=>{
                    this.evento = {...evento};
                    this.form.patchValue(this.evento);
                    if(this.evento.imagemUrl !== '')
                    {
                        this.imagemURL = environment.apiURL +'resources/images/'+this.evento.imagemUrl;
                    }else{
                        this.imagemURL = '../../../../assets/layout/images/upload_icon.png';
                    }
                    this.carregarLotes();
                    //Abaixo, outra forma de fazer sem requisicao.
                   // this.evento.lotes.forEach(lote => {
                     ///   this.lotes.push(this.criarLote(lote));
                   // })
                },
                error: (error: any)=>{
                    console.log(error);
                },
                complete: ()=>{},
            })
        }
        // this.validation();
    }

    public carregarLotes(): void{
        this.loteService.getLotesByEventoId(this.eventoId)
            .subscribe(
                (lotes: Lote[]) => {
                    lotes.forEach(lote => {
                        this.lotes.push(this.criarLote(lote));
                    })
                },
                (error:any) => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Erro ao tentar carregar lotes.', life: 3000});
                    console.error(error);
                }
             )
    }
    ngOnInit(): void {
        this.loadEvento();
        this.validation();

        this.cardMenu = [
            {
                label: 'Save', icon: 'pi pi-fw pi-check'
            },
            {
                label: 'Update', icon: 'pi pi-fw pi-refresh'
            },
            {
                label: 'Delete', icon: 'pi pi-fw pi-trash'
            },
        ];

    }

    public validation(): void {
        this.form = this.fb.group({
            tema: ['',[Validators.required, Validators.minLength(4),Validators.maxLength(50)]],
            local: ['',Validators.required],
            dataEvento: ['',Validators.required],
            qtdPessoas: ['',[Validators.required,Validators.pattern('[0-9]+$'), Validators.max(120000)]],
            imagemUrl: '',
            telefone: ['',Validators.required],
            email: ['',[Validators.required, Validators.email]],
            lotes: this.fb.array([])
        });
    }
    adicionarLote(): void {
        this.lotes.push(this.criarLote({id:0} as Lote));
    }
    criarLote(lote: Lote): FormGroup{
        return this.fb.group({
            id: [lote.id],
            nome:[lote.nome, Validators.required],
            quantidade:[lote.quantidade, Validators.required],
            preco:[lote.preco,Validators.required],
            dataInicio:[lote.dataInicio, Validators.required],
            dataFim:[lote.dataFim, Validators.required]

        })
    }
    public resetForm(): void{
        this.form.reset();
    }

    public salvarEventos(): void {
        if(this.router.snapshot.paramMap.get('id')== null){
            if(this.form.valid){
                this.evento = {... this.form.value}
                this.eventoService.postEvento(this.evento).subscribe(
                    (eventoRetorno: Evento)=>{ this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Evento salvo.', life: 3000});
                          this.routerNavigate.navigate([`eventos/detalhe/${eventoRetorno.id}`]); },
                    (error:any)=>{
                        console.log(error);
                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Erro ao salvar evento.', life: 3000});
                    },
                    ()=>{}
                )
            }
        }else{
            if(this.form.valid){
                this.evento = {id: this.evento.id, ... this.form.value}
                this.eventoService.putEvento(this.evento.id,this.evento).subscribe(
                    ()=>{ this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Evento editado.', life: 3000});},
                    (error:any)=>{
                        console.log(error);
                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Erro ao salvar evento.', life: 3000});
                    },
                    ()=>{this.routerNavigate.navigate(['/eventos'])}
                )
            }
        }

    }

    public salvarLotes(): void{
        if(this.form.controls.lotes.valid){
            this.loteService.saveLotes(this.eventoId, this.form.value.lotes)
                .subscribe(
                    () => {
                        this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Lotes adicionados.', life: 3000});
                    },
                    (error: any) => {
                        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Erro ao salvar lotes.', life: 3000});
                        console.error(error);
                    },
                );
        }
    }
    public removerLote(indice : number):void{
        this.loteAtual.id = this.lotes.get(indice + '.id').value;
        this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
        this.loteAtual.indice = indice;
        if(this.lotes.length> 0 && this.loteAtual.id !== 0){
            this.confirmationService.confirm({
                message: 'Tem certeza que quer deletar o '+this.loteAtual.nome+' ?',
                header: 'Confirme',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel:'Sim',
                rejectLabel: 'Não',
                accept: () => {
                    this.loteService.deleteLote(this.eventoId,this.loteAtual.id).subscribe(
                    (result: any) => {
                            this.messageService.add({severity: 'success', summary: 'Successo', detail: 'O Lote foi deletado', life: 3000});
                            this.lotes.removeAt(this.loteAtual.indice);
                    },(error: any)=>{
                        this.messageService.add({severity: 'error', summary: 'Error ao deletar Lote', detail: error, life: 3000});
                    }, ()=>{});
                }
            });
        }else{
            this.lotes.removeAt(this.loteAtual.indice);
            this.messageService.add({severity: 'success', summary: 'Successo', detail: 'O Formulario removido.', life: 3000});
        }


    }
    onFileChange(ev: any): void{
        const reader = new FileReader();
        reader.onload = (event: any) => this.imagemURL = event.target.result;
        this.file = ev.target.files;
        reader.readAsDataURL(this.file[0]);
        this.uploadImagem();
    }
    uploadImagem():void{
        this.eventoService.postUpload(this.eventoId, this.file).subscribe(
            () =>{
                this.loadEvento();
                this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Imagem do evento salva.', life: 3000});},
            (error: any) =>{ this.messageService.add({severity: 'error', summary: 'Error', detail: 'Erro ao salvar imagem do evento.', life: 3000});
            console.error(error);}
        )
    }
}
