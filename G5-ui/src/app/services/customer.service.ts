import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {

    const usuario = JSON.parse(
      localStorage.getItem('sesion') || 'null'
    );

    if (!usuario || !usuario.token) {

      return new HttpHeaders({
        'Content-Type': 'application/json'
      });

    }

    return new HttpHeaders({
      'Authorization': `Bearer ${usuario.token}`,
      'Content-Type': 'application/json'
    });

  }

  // PRODUCTOS
  getProductosActivos(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/productos`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // MÉTODOS DE PAGO
  getMetodosPago(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/metodos-pago`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // MOTOCICLETAS
  getMisMotocicletas(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/motocicletas`,
      {
        headers: this.getHeaders()
      }
    );
  }

  registrarMotocicleta(moto: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/motocicletas`,
      moto,
      {
        headers: this.getHeaders()
      }
    );
  }

  // FACTURAS
  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/facturas`,
      factura,
      {
        headers: this.getHeaders()
      }
    );
  }

}