import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:8080/api/facturas';

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

  // Mapea directo al @GetMapping de tu controlador (Trae todas las facturas del sistema)
  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHttpOptions());
  }

  // Mapea directo al @PatchMapping("/{id}/estado") de tu controlador
  actualizarEstado(id: number, estado: string): Observable<any> {
    // Como tu backend usa @RequestParam, pasamos el estado en la URL como query param
    return this.http.patch<any>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {}, this.getHttpOptions());
  }

}
