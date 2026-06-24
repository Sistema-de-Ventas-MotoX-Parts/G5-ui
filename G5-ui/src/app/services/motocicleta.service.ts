import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotocicletaService {
  private apiUrl = 'http://localhost:8080/api/motocicletas';

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    let headers = new HttpHeaders();
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

  crear(moto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, moto, this.getHttpOptions());
  }

  actualizar(id: number, moto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, moto, this.getHttpOptions());
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}