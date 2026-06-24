import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // URL para la gestión de usuarios (ADMIN)
  private apiUrl = 'http://localhost:8080/api/auth/usuarios';
  
  // URL para el perfil del usuario autenticado (COOKIES)
private perfilUrl = 'http://localhost:8080/api/usuarios/perfil';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Función privada auxiliar para la administración (mantiene tu token manual)
  private getHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /* ════════════════════════════════════════════════════════════════ ***
     MÉTODOS DE ADMINISTRACIÓN 
     *** ════════════════════════════════════════════════════════════════ */

  // GET: Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // POST: Crear un nuevo usuario (Solo ADMIN)
  createUser(usuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.apiUrl, usuario, { headers });
  }

  // PUT: Actualizar un usuario existente (Solo ADMIN)
  updateUser(id: number, usuario: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario, { headers });
  }

  // DELETE: Eliminar un usuario (Solo ADMIN)
  deleteUser(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  /* ════════════════════════════════════════════════════════════════ ***
     NUEVOS MÉTODOS DE MI PERFIL (Agregados para el Dashboard de Usuario)
     *** ════════════════════════════════════════════════════════════════ */

  // 1. GET: Obtener Mi Perfil propio usando cookies
  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(this.perfilUrl, { withCredentials: true });
  }

  // 2. PUT: Editar Mi Perfil propio usando cookies
  actualizarPerfil(datosPerfil: any): Observable<any> {

  const token = this.authService.obtenerToken();

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.put<any>(
    this.perfilUrl,
    datosPerfil,
    {
      headers,
      withCredentials: true
    }
  );
}

  // 3. DELETE: Eliminar Mi propia Cuenta usando cookies
  eliminarPerfil(): Observable<any> {
    return this.http.delete<any>(this.perfilUrl, { withCredentials: true });
  }
}