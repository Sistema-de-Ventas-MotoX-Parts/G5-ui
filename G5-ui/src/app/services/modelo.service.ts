import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private url = 'http://localhost:8080/api/modelos';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.url, { headers: this.getHeaders() });
  }

  listarPorMarca(marcaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/marca/${marcaId}`, { headers: this.getHeaders() });
  }

  crear(modelo: any): Observable<any> {
    return this.http.post<any>(this.url, modelo, { headers: this.getHeaders() });
  }

  actualizar(id: number, modelo: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, modelo, { headers: this.getHeaders() });
  }

  borrar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }
}     