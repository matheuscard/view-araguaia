import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AppBreadcrumbService } from 'src/app/app.breadcrumb.service';
import { CostCenter } from 'src/app/models/Cashier/CostCenter';
import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { CostCenterService } from 'src/app/services/CostCenter.service';

@Component({
  selector: 'app-cost-center-list',
  templateUrl: './cost-center-list.component.html',
  styleUrls: ['./cost-center-list.component.scss'],
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
export class CostCenterListComponent implements OnInit {
    costCenterDialog: boolean;

    costCenters: CostCenter[] = [];
    costCenter: CostCenter;

    pagination = {} as Pagination;

    selectedCostCenters: CostCenter[];

    ids: number[] = [];
    submitted: boolean;

    cols: any[];

    termoBuscaChanged: Subject<string> = new Subject<string>();

    loading: boolean;

    virtualDatabase: CostCenter[] = [];

    totalRecords: number;
    pageChange: boolean;

    checkAllCostCenters: boolean;

    term:string;

    filtrarCostCenters(evt: any): void {
        this.loading = true;
        if (this.termoBuscaChanged.observers.length === 0) {
            this.termoBuscaChanged
                .pipe(debounceTime(1000))
                .subscribe((filtrarPor) => {
                    this.costCenterService
                        .getCostCenters(
                            this.pagination.currentPage,
                            this.pagination.itemsPerPage,
                            filtrarPor
                        )
                        .subscribe({
                            next: (
                                paginatedResult: PaginatedResult<CostCenter[]>
                            ) => {
                                this.term = filtrarPor;
                                console.log(this.term);
                                this.costCenters = paginatedResult.result;
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
        private costCenterService: CostCenterService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {
        this.breadcrumbService.setItems([
            {  label: 'Financeiro' },
            {  label: "Centro de Custo", routerLink: ["/cost-center"] },
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
        this.getCostCenters();
        console.log(this.costCenters);
        this.cols = [
            { field: "id", header: "Id" },
            { field: "classification", header: "Classificação" },
            { field: "description", header: "Descrição" },
        ];
    }

    public getCostCenters(): void {
        this.costCenterService
            .getCostCenters(
                this.pagination.currentPage,
                this.pagination.itemsPerPage
            )
            .subscribe({
                next: (paginatedResult: PaginatedResult<CostCenter[]>) => {
                    this.costCenters = paginatedResult.result;
                    this.virtualDatabase = paginatedResult.result;
                    this.totalRecords = paginatedResult.pagination.totalItems;
                    this.pagination = paginatedResult.pagination;
                },
                error: (error: any) => console.log(error),
            });
    }

    openNew() {
        this.costCenter = null;
        this.submitted = false;
        this.costCenterDialog = true;
    }

    hideDialog() {
        this.costCenterDialog = false;
        this.submitted = false;
    }

    deleteCostCenter(costCenter: CostCenter) {
        this.confirmationService.confirm({
            message: "Tem certeza que quer deletar " + costCenter.description + "?",
            header: "Confirme",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: () => {
                this.costCenterService.deleteCostCenter(costCenter.id).subscribe(
                    (result: any) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Successo",
                            detail: "O centro de custo foi deletado com sucesso.",
                            life: 3000,
                        });
                        this.getCostCenters();
                    },
                    (error: any) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Error ao deletar o centro de custo.",
                            detail: error,
                            life: 3000,
                        });
                    },
                    () => {
                        this.getCostCenters();
                    }
                );
            },
        });
    }
    deleteSelectedCostCenters() {
        this.confirmationService.confirm({
            message: "Certeza de que quer deletar os centros de custo selecionados ?",
            header: "Confirme",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim",
            rejectLabel: "Não",
            accept: () => {
                this.selectedCostCenters.forEach((e) => {
                    this.ids.push(e.id);
                });
                console.log(this.ids);
                this.costCenterService.deleteCostCenters(this.ids).subscribe(
                    (result: any) => {
                        console.log(result);
                        this.messageService.add({
                            severity: "success",
                            summary: "Successo",
                            detail: result.message,
                            life: 3000,
                        });
                        this.getCostCenters();
                    },
                    (error: any) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Error ao deletar centros de custos.",
                            detail: error,
                            life: 3000,
                        });
                    },
                    () => {
                        this.getCostCenters();
                    }
                );
                this.selectedCostCenters = null;
                this.ids = [];
            },
        });
    }
    editCostCenter(costCenter: CostCenter) {
        this.costCenter = { ...costCenter };
        this.costCenterDialog = true;
    }

    saveProduct() {
        this.submitted = true;

        if (this.costCenter.description.trim()) {
            if (this.costCenter.id) {
                this.costCenters[this.findIndexById(this.costCenter.id.toString())] =
                    this.costCenter;
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                });
            } else {
                this.costCenter.id = this.createId();
                this.costCenter.description = "product-placeholder.svg";
                this.costCenters.push(this.costCenter);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Created",
                    life: 3000,
                });
            }

            this.costCenters = [...this.costCenters];
            this.costCenterDialog = false;
            this.costCenter = null;
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.costCenters.length; i++) {
            if (this.costCenters[i].id.toString() === id) {
                index = i;
                break;
            }
        }

        return index;
    }
    createId(): number {
        let id = 0;
        id = this.costCenters.length;
        id++;
        return id;
    }
    detalheCostCenter(id: number): void {
        this.router.navigate([`costCenters/detalhe/${id}`]);
    }
    pageChanged(event: LazyLoadEvent): void {
        this.pagination.currentPage = event.first / event.rows + 1;
        if(this.term != ''){
            this.pageChangedFiltrada(this.term)
        }else{
            this.getCostCenters();
        }
        this.pageChange = true;

    }
    pageChangedFiltrada(term:string):void{
        this.costCenterService
                        .getCostCenters(
                            this.pagination.currentPage,
                            this.pagination.itemsPerPage,
                            term
                        )
                        .subscribe({
                            next: (
                                paginatedResult: PaginatedResult<CostCenter[]>
                            ) => {
                                this.costCenters = paginatedResult.result;
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
            this.selectedCostCenters = this.costCenters;
        }else{
            this.selectedCostCenters = null;
        }
	}
    loadLazyCostCenters(event: LazyLoadEvent) {
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
                this.costCenters = this.virtualDatabase.slice(
                    event.first,
                    event.first + event.rows
                );

            }else{
                this.pageChanged(event);
                this.checkAllCostCenters = false;
                this.selectedCostCenters = null;
            }
        }, 1);
        this.loading  = false;

    }
}
