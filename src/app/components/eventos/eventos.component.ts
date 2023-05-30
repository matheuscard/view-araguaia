import { Component, OnInit } from "@angular/core";
import { MessageService, ConfirmationService, Message } from "primeng/api";
import { Evento } from "../../models/Evento";
import {AppBreadcrumbService} from '../../app.breadcrumb.service';
import { EventoService } from "src/app/services/Evento.service";
import { PaginatedResult, Pagination } from "src/app/models/Pagination";

@Component({
    selector: "app-eventos",
    templateUrl: "./eventos.component.html",
    styleUrls: ["../../demo/view/tabledemo.scss"],

    styles: [`
    :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }

    @media screen and (max-width: 960px) {
        :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
            text-align: center;
        }

        :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
            display: flex;
        }
    }

`],
    providers: [MessageService, ConfirmationService]
})
export class EventosComponent implements OnInit {
    eventoDialog: boolean;

    private _filtroLista: string = '';
    eventos: Evento[] = [];
    eventosFiltrados: Evento[] = [];
    evento: Evento;

    pagination = {} as Pagination;

    selectedEventos: Evento[];

    submitted: boolean;

    cols: any[];

    public get filtroLista(){
        return this._filtroLista;
    }

    public set filtroLista(value: string){
        this._filtroLista = value;
        this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }
    filtrarEventos(filtrarPor: string):Evento[]{
        filtrarPor = filtrarPor.toLocaleLowerCase();
        return this.eventos.filter(
            evento => evento
            .tema
            .toLowerCase()
            .indexOf(filtrarPor) !== -1 ||
            evento
            .local
            .toLowerCase()
            .indexOf(filtrarPor) !== -1)
    }
    constructor(private eventoService: EventoService, private messageService: MessageService,
                private confirmationService: ConfirmationService, private breadcrumbService: AppBreadcrumbService) {
                    this.breadcrumbService.setItems([
                        { label: 'Eventos', routerLink: ['/eventos'] }
                    ]);
                }

    ngOnInit(): void {

        this.cols = [
            {field: 'id', header: 'Id'},
            {field: 'local', header: 'Local'},
            {field: 'dataEvento', header: 'DataEvento'},
            {field: 'tema', header: 'Tema'},
            {field: 'lote', header: 'Lote'},
            {field: 'qtdPessoas', header: 'QtdePessoas'}
        ];
    }


    openNew() {
        this.evento = null;
        this.submitted = false;
        this.eventoDialog = true;
    }

    hideDialog() {
        this.eventoDialog = false;
        this.submitted = false;
    }

    deleteEvento(evento: Evento) {
        this.confirmationService.confirm({
            message: 'Tem certeza que quer deletar ' + evento.local + '?',
            header: 'Confirme',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.eventos = this.eventos.filter(val => val.id !== evento.id);
                this.eventosFiltrados = this.eventos
                this.evento = null;
                this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Evento Deletado', life: 3000});
            }
        });
    }
    deleteSelectedEventos() {
        this.confirmationService.confirm({
            message: 'Certeza de que quer deletar os eventos selecionados ?',
            header: 'Confirme',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel:'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.eventos = this.eventos.filter(val => !this.selectedEventos.includes(val));
                this.eventosFiltrados = this.eventos
                this.selectedEventos = null;
                this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Eventos Deletados', life: 3000});
            }
        });
    }
    editEvento(evento: Evento) {
        this.evento = {...evento};
        this.eventoDialog = true;
    }


    saveProduct() {
        this.submitted = true;

        if (this.evento.local.trim()) {
            if (this.evento.id) {
                this.eventos[this.findIndexById(this.evento.id.toString())] = this.evento;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            } else {
                this.evento.id = this.createId();
                this.evento.imagemUrl = 'product-placeholder.svg';
                this.eventos.push(this.evento);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.eventos = [...this.eventos];
            this.eventosFiltrados = [...this.eventos];
            this.eventoDialog = false;
            this.evento = null;
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.eventos.length; i++) {
            if (this.eventos[i].id.toString() === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    createId(): number {
        let id = 0;
        id = this.eventos.length;
        id ++
        return id;
    }

}
