import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    MessageService,
    ConfirmationService,
    Message,
    LazyLoadEvent,
} from "primeng/api";
import { Evento } from "../../../models/Evento";
import { AppBreadcrumbService } from "../../../app.breadcrumb.service";
import { Router, RouterLink } from "@angular/router";
import { EventoService } from "src/app/services/Evento.service";
import { PaginatedResult, Pagination } from "src/app/models/Pagination";
import { Subject } from "rxjs";
import { debounce, debounceTime } from "rxjs/operators";
import { lazy } from "preact/compat";

@Component({
    selector: "app-eventos",
    templateUrl: "./evento-lista.component.html",
    styleUrls: ["../../../demo/view/tabledemo.scss"],
    styles: [
        `
            :host ::ng-deep .p-dialog .product-image {
                width: 150px;
                margin: 0 auto 2rem auto;
                display: block;
            }

            @media screen and (max-width: 960px) {
                :host
                    ::ng-deep
                    .p-datatable.p-datatable-customers
                    .p-datatable-tbody
                    > tr
                    > td:last-child {
                    text-align: center;
                }

                :host
                    ::ng-deep
                    .p-datatable.p-datatable-customers
                    .p-datatable-tbody
                    > tr
                    > td:nth-child(6) {
                    display: flex;
                }
            }
        `,
    ],
    providers: [MessageService, ConfirmationService],
})
export class EventoListaComponent implements OnInit {
    eventoDialog: boolean;

    eventos: Evento[] = [];
    evento: Evento;

    pagination = {} as Pagination;

    selectedEventos: Evento[];

    ids: number[] = [];
    submitted: boolean;

    cols: any[];

    termoBuscaChanged: Subject<string> = new Subject<string>();

    loading: boolean;

    virtualDatabase: Evento[] = [];

    totalRecords: number;
    pageChange: boolean;

    checkAllEventos: boolean;

    term:string;

    filtrarEventos(evt: any): void {
        this.loading = true;
        if (this.termoBuscaChanged.observers.length === 0) {
            this.termoBuscaChanged
                .pipe(debounceTime(1000))
                .subscribe((filtrarPor) => {
                    this.eventoService
                        .getEventos(
                            this.pagination.currentPage,
                            this.pagination.itemsPerPage,
                            filtrarPor
                        )
                        .subscribe({
                            next: (
                                paginatedResult: PaginatedResult<Evento[]>
                            ) => {
                                this.term = filtrarPor;
                                console.log(this.term);
                                this.eventos = paginatedResult.result;
                                this.pagination = paginatedResult.pagination;
                                this.virtualDatabase = paginatedResult.result;
                                this.totalRecords = paginatedResult.pagination.totalItems;
                                this.pagination = paginatedResult.pagination;
                            },
                            error: (error: any) => console.log(error),
                            complete: () => {
                                this.loading = false;
                            },
                        });
                });
        }
        this.termoBuscaChanged.next(evt.value);
    }

    constructor(
        private eventoService: EventoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.breadcrumbService.setItems([
            { label: "Eventos", routerLink: ["/eventos"] },
        ]);
    }

    ngAfterViewChecked() {
        //your code to update the model
        this.cdr.detectChanges();

    }

    ngOnInit(): void {
        this.pagination = {
            currentPage: 1,
            itemsPerPage: 3,
            totalItems: 1,
        } as Pagination;
        this.getEventos();

        this.cols = [
            { field: "id", header: "Id" },
            { field: "local", header: "Local" },
            { field: "dataEvento", header: "DataEvento" },
            { field: "tema", header: "Tema" },
            { field: "lote", header: "Lote" },
            { field: "qtdPessoas", header: "QtdePessoas" },
        ];
    }

    public getEventos(): void {
        this.eventoService
            .getEventos(
                this.pagination.currentPage,
                this.pagination.itemsPerPage
            )
            .subscribe({
                next: (paginatedResult: PaginatedResult<Evento[]>) => {
                    this.eventos = paginatedResult.result;
                    this.virtualDatabase = paginatedResult.result;
                    this.totalRecords = paginatedResult.pagination.totalItems;
                    this.pagination = paginatedResult.pagination;
                },
                error: (error: any) => console.log(error),
            });
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
            message: "Tem certeza que quer deletar " + evento.local + "?",
            header: "Confirme",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: () => {
                this.eventoService.deleteEvento(evento.id).subscribe(
                    (result: any) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successo",
                            detail: "O Evento foi deletado",
                            life: 3000,
                        });
                        this.getEventos();
                    },
                    (error: any) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Error ao deletar o evento",
                            detail: error,
                            life: 3000,
                        });
                    },
                    () => {
                        this.getEventos();
                    }
                );
            },
        });
    }
    deleteSelectedEventos() {
        this.confirmationService.confirm({
            message: "Certeza de que quer deletar os eventos selecionados ?",
            header: "Confirme",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: () => {
                this.selectedEventos.forEach((e) => {
                    this.ids.push(e.id);
                });
                console.log(this.ids);
                this.eventoService.deleteEventos(this.ids).subscribe(
                    (result: any) => {
                        console.log(result);
                        this.messageService.add({
                            severity: "success",
                            summary: "Successo",
                            detail: result.message,
                            life: 3000,
                        });
                        this.getEventos();
                    },
                    (error: any) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Error ao deletar eventos",
                            detail: error,
                            life: 3000,
                        });
                    },
                    () => {
                        this.getEventos();
                    }
                );
                this.selectedEventos = null;
                this.ids = [];
            },
        });
    }
    editEvento(evento: Evento) {
        this.evento = { ...evento };
        this.eventoDialog = true;
    }

    saveProduct() {
        this.submitted = true;

        if (this.evento.local.trim()) {
            if (this.evento.id) {
                this.eventos[this.findIndexById(this.evento.id.toString())] =
                    this.evento;
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                });
            } else {
                this.evento.id = this.createId();
                this.evento.imagemUrl = "product-placeholder.svg";
                this.eventos.push(this.evento);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Created",
                    life: 3000,
                });
            }

            this.eventos = [...this.eventos];
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
        id++;
        return id;
    }
    detalheEvento(id: number): void {
        this.router.navigate([`eventos/detalhe/${id}`]);
    }
    pageChanged(event: LazyLoadEvent): void {
        this.pagination.currentPage = event.first / event.rows + 1;
        if(this.term != ''){
            this.pageChangedFiltrada(this.term)
        }else{
            this.getEventos();
        }
        this.pageChange = true;

    }
    pageChangedFiltrada(term:string):void{
        this.eventoService
                        .getEventos(
                            this.pagination.currentPage,
                            this.pagination.itemsPerPage,
                            term
                        )
                        .subscribe({
                            next: (
                                paginatedResult: PaginatedResult<Evento[]>
                            ) => {
                                this.eventos = paginatedResult.result;
                                this.pagination = paginatedResult.pagination;
                                this.virtualDatabase = paginatedResult.result;
                                this.totalRecords = paginatedResult.pagination.totalItems;
                                this.pagination = paginatedResult.pagination;
                            },
                            error: (error: any) => console.log(error),
                            complete: () => {
                            },
                        });
    }
    checkAll(event: any):void{
        console.log(event);
    }


    checkAllCheckBox(ev: any) {
		if(ev.checked.length>0){
            this.selectedEventos = this.eventos;
        }else{
            this.selectedEventos = null;
        }
	}
    loadLazyEventos(event: LazyLoadEvent) {
        this.loading = true;
        setTimeout(() => {

            if (event.sortField) {
                this.virtualDatabase.sort((data1, data2) => {
                    let value1 = data1[event.sortField];
                    let value2 = data2[event.sortField];
                    let result = null;

                    if (value1 == null && value2 != null) result = -1;
                    else if (value1 != null && value2 == null) result = 1;
                    else if (value1 == null && value2 == null) result = 0;
                    else if (
                        typeof value1 === "string" &&
                        typeof value2 === "string"
                    )
                        result = value1.localeCompare(value2);
                    else
                        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                    return event.sortOrder * result;
                });
            }
        }, 500);

        setTimeout(() => {
            if (!this.pageChange) {
                this.eventos = this.virtualDatabase.slice(
                    event.first,
                    event.first + event.rows
                );

            }else{
                this.pageChanged(event);
                this.checkAllEventos = false;
                this.selectedEventos = null;
            }
        }, 1);
        this.loading  = false;

    }
}
