import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient) {}

  // Generamos las opciones dinámicamente con el token de sesión
  private getHttpOptions() {
    let headers = new HttpHeaders();
    
    // 1. Buscamos el objeto sesión que guardó el login
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      const datosUsuario = JSON.parse(sesion);
      // 2. Si el token existe, lo metemos en la cabecera Authorization
      if (datosUsuario.token) {
        headers = headers.set('Authorization', `Bearer ${datosUsuario.token}`);
      }
    }

    return {
      headers: headers,
      withCredentials: true // Mantiene el soporte por si el back usa la cookie token_jwt
    };
  }

  listarServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHttpOptions());
  }

  obtenerServicioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  crearServicio(servicio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, servicio, this.getHttpOptions());
  }

  actualizarServicio(id: number, servicio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, servicio, this.getHttpOptions());
  }

  eliminarServicio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}