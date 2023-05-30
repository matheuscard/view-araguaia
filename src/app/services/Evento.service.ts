import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Evento } from '../models/Evento'
import { PaginatedResult } from '../models/Pagination';

@Injectable()
export class EventoService {
    baseURL = environment.apiURL+"api/evento";
    constructor(private http: HttpClient) { }

    public getEventos(page?: number, itemsPerPage?: number, term?: string):Observable<PaginatedResult<Evento[]>> {
        const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

        let params = new HttpParams;



        if( page != null && itemsPerPage != null){
            params = params.append('pagenumber', page.toString());
            params = params.append('pagesize', itemsPerPage.toString());
        }
        if(term !=null && term != '')
            params = params.append('term', term);

        return this.http
        .get<Evento[]>(this.baseURL, {observe: 'response', params})
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

    public getEventosByTema(tema: string):Observable<Evento[]> {
        return this.http.get<Evento[]>(`${this.baseURL}/tema/${tema}`).pipe(take(1));
    }

    public getEventosById(id: number):Observable<Evento> {
        return this.http.get<Evento>(`${this.baseURL}/${id}`).pipe(take(1));
    }
    public postEvento(evento: Evento):Observable<Evento>{
        return this.http.post<Evento>(this.baseURL, evento, ).pipe(take(1));
    }
    public putEvento(id: number, evento: Evento):Observable<Evento>{
        return this.http.put<Evento>(`${this.baseURL}/${id}`, evento ).pipe(take(1));
    }
    public deleteEvento(id: number): Observable<any>{
        return this.http.delete<string>(`${this.baseURL}/${id}`).pipe(take(1));
    }
    public deleteEventos(ids:number[]):Observable<any>{
        return this.http.post<number[]>(`${this.baseURL}/delete-eventos/`,ids).pipe(take(1));
    }
    public postUpload(eventoId: number, file: File): Observable<Evento>{
        const fileUpload =  file[0] as File;
        const formData = new FormData();
        formData.append('file', fileUpload);
        return this.http.post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData).pipe(take(1));
    }
}
