import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private url = 'http://localhost:8080/api/marcas';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { headers: this.getHeaders() });
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  crear(marca: any): Observable<any> {
    return this.http.post<any>(this.url, marca, { headers: this.getHeaders() });
  }

  actualizar(id: number, marca: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, marca, { headers: this.getHeaders() });
  }

  borrar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }
}