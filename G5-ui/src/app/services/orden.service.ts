import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = 'http://localhost:8080/api/ordenes';

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    // 🌟 DECLARAMOS EL CONTENT-TYPE POR DEFECTO PARA QUE JACKSON PARSEE BIEN LOS NÚMEROS
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      const datosUsuario = JSON.parse(sesion);
      if (datosUsuario.token) {
        headers = headers.set('Authorization', `Bearer ${datosUsuario.token}`);
      }
    }
    return { headers, withCredentials: true };
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHttpOptions());
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  crear(orden: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orden, this.getHttpOptions());
  }

  actualizar(id: number, orden: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, orden, this.getHttpOptions());
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
