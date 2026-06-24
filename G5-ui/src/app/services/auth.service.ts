import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(datos: any) {
    return this.http.post(`${this.apiUrl}/login`, datos);
  }

  register(datos: any) {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }

  guardarSesion(usuario: any) {
    localStorage.setItem('sesion', JSON.stringify(usuario));
  }

  obtenerSesion() {
    return JSON.parse(localStorage.getItem('sesion') || 'null');
  }

  obtenerToken() {
    const usuario = this.obtenerSesion();
    return usuario?.token || null;
  }

  logout() {
    localStorage.removeItem('sesion');
  }

  /**
   * Método privado auxiliar para verificar el rol sin repetir código.
   * Soporta tanto si el backend devuelve el string directo ("ADMIN")
   * o un objeto dentro del usuario ({ nombre: "ADMIN" })
   */
  private verificarRol(rolEsperado: string): boolean {
    const usuario = this.obtenerSesion();
    if (!usuario) return false;

    return usuario.rol?.nombre === rolEsperado || usuario.rol === rolEsperado;
  }

  // --- CONTROL DE ROLES ---

  esAdmin(): boolean {
    return this.verificarRol('ADMIN');
  }

  esUsuario(): boolean {
    return this.verificarRol('USER');
  }

  esCliente(): boolean {
    return this.verificarRol('CLIENT'); // 👈 Nuevo rol Client
  }

  esMecanico(): boolean {
    return this.verificarRol('MECHANIC'); // 👈 Nuevo rol Mechanic
  }
}
