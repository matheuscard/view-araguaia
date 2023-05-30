import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Lote } from '../models/Lote';

@Injectable()
export class LoteService {
    baseURL = "https://localhost:7027/api/lote";
    constructor(private http: HttpClient) { }

     public getLotesByEventoId(eventoId: number):Observable<Lote[]> {
        return this.http.get<Lote[]>(`${this.baseURL}/${eventoId}`).pipe(take(1));
    }

    public saveLotes(eventoId: number, lotes: Lote[]):Observable<Lote[]>{
        return this.http.put<Lote[]>(`${this.baseURL}/${eventoId}`, lotes).pipe(take(1));
    }
    public deleteLote(eventoId: number, loteId: number): Observable<any>{
        return this.http.delete<string>(`${this.baseURL}/${eventoId}/${loteId}`).pipe(take(1));
    }
}
