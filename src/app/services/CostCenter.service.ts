import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CostCenter } from '../models/Cashier/CostCenter';
import { PaginatedResult } from '../models/Pagination';

@Injectable()
export class CostCenterService {
    baseURL = environment.apiCashier+"costcenter";
    constructor(private http: HttpClient) { }

    public getCostCenters(page?: number, itemsPerPage?: number, term?: string):Observable<PaginatedResult<CostCenter[]>> {
        const paginatedResult: PaginatedResult<CostCenter[]> = new PaginatedResult<CostCenter[]>();

        let params = new HttpParams;



        if( page != null && itemsPerPage != null){
            params = params.append('pagenumber', page.toString());
            params = params.append('pagesize', itemsPerPage.toString());
        }
        if(term !=null && term != '')
            params = params.append('term', term);

        return this.http
        .get<CostCenter[]>(this.baseURL, {observe: 'response', params})
        .pipe(
            take(1)
            , map((response) => {
                paginatedResult.result = response.body;
                if(response.headers.has('Pagination')){
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            }));
    }

    public getCostCentersByTema(tema: string):Observable<CostCenter[]> {
        return this.http.get<CostCenter[]>(`${this.baseURL}/tema/${tema}`).pipe(take(1));
    }

    public getCostCentersById(id: number):Observable<CostCenter> {
        return this.http.get<CostCenter>(`${this.baseURL}/${id}`).pipe(take(1));
    }
    public postCostCenter(costCenter: CostCenter):Observable<CostCenter>{
        return this.http.post<CostCenter>(this.baseURL, costCenter, ).pipe(take(1));
    }
    public putCostCenter(id: number, costCenter: CostCenter):Observable<CostCenter>{
        return this.http.put<CostCenter>(`${this.baseURL}/${id}`, costCenter ).pipe(take(1));
    }
    public deleteCostCenter(id: number): Observable<any>{
        return this.http.delete<string>(`${this.baseURL}/${id}`).pipe(take(1));
    }
    public deleteCostCenters(ids:number[]):Observable<any>{
        return this.http.post<number[]>(`${this.baseURL}/delete-costcenters/`,ids).pipe(take(1));
    }
    public postUpload(costCenterId: number, file: File): Observable<CostCenter>{
        const fileUpload =  file[0] as File;
        const formData = new FormData();
        formData.append('file', fileUpload);
        return this.http.post<CostCenter>(`${this.baseURL}/upload-image/${costCenterId}`, formData).pipe(take(1));
    }
}
