import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mecanico-ordenes',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .taller-container { padding: 2rem; font-family: 'Inter', sans-serif; background: #000; color: #fff; min-height: 100vh; }
    .orden-tarjeta { background: #0d0d0d; border: 1px solid #222; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
    .badge { padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
    .badge-ingresada { background: rgba(250,204,21,0.1); color: #FACC15; border: 1px solid #facc15; }
    .badge-proceso { background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid #3b82f6; }
    .btn-accion { background: #FACC15; color: #000; font-weight: bold; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
  `],
  template: `
    <div class="taller-container">
      <h2 style="font-family: 'Oswald', sans-serif; text-transform: uppercase;">
        Panel de Trabajo: <span style="color: #FACC15;">Mis Asignaciones</span>
      </h2>
      <p style="color: #888;">Mecánico Activo: <strong>{{ miUsuario?.nombre || miUsuario?.username || 'Cargando...' }} (ID: {{ miIdUsuario }})</strong></p>

      <div *ngIf="misOrdenes().length === 0" style="color: #555; padding: 2rem; text-align: center;">
        No tenés órdenes de trabajo asignadas en este momento. ¡Buen trabajo!
      </div>

      <div class="orden-tarjeta" *ngFor="let orden of misOrdenes()">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3>Orden #{{ orden.id }}</h3>
          <span class="badge" [ngClass]="orden.estado === 'MOTO_INGRESADA' ? 'badge-ingresada' : 'badge-proceso'">
            {{ orden.estado }}
          </span>
        </div>
        
        <p><strong>Motocicleta:</strong> {{ orden.marcaModeloMoto || orden.patenteMoto || 'ID: ' + orden.idMoto }}</p>
        <p style="color: #aaa;"><strong>Síntomas/Notas del Admin:</strong> {{ orden.notas || 'Sin notas de ingreso' }}</p>
        
        <div style="margin-top: 1rem; text-align: right;">
          <button *ngIf="orden.estado === 'MOTO_INGRESADA'" class="btn-accion" (click)="comenzarService(orden.id)">
            🛠️ Comenzar Reparación
          </button>
          
          <button *ngIf="orden.estado === 'REALIZANDOSE_SERVICE'" class="btn-accion" style="background: #4ade80;" (click)="terminarService(orden.id)">
            ✅ Terminar Servicio y Generar PIN
          </button>
        </div>
      </div>
    </div>
  `
})
export class MecanicoOrdenesComponent implements OnInit {
  misOrdenes = signal<any[]>([]);
  miIdUsuario: number = 0;
  miUsuario: any = null;

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.obtenerToken()}` });
  }

  ngOnInit() {
    this.obtenerMiPerfilYOrdenes();
  }

  obtenerMiPerfilYOrdenes() {
    // 1. Consultamos el endpoint real del perfil para saber qué ID de mecánico somos de verdad
    this.http.get<any>('http://localhost:8080/api/usuarios/perfil', { headers: this.getHeaders() }).subscribe({
      next: (user) => {
        this.miUsuario = user;
        this.miIdUsuario = user.id; // Guardamos tu ID verdadero (ej: 3)
        
        // 2. Una vez que sabemos quiénes somos, cargamos las órdenes reales
        this.cargarMisOrdenesDelBackend();
      },
      error: () => console.error('Error identificando el perfil del mecánico.')
    });
  }

  cargarMisOrdenesDelBackend() {
    this.http.get<any[]>('http://localhost:8080/api/ordenes', { headers: this.getHeaders() }).subscribe({
      next: (todasLasOrdenes) => {
        // Filtrado en caliente: Nos quedamos solo con las órdenes cuyo idMecanico coincida con tu ID de perfil
        const filtradas = todasLasOrdenes.filter(o => {
          const idMec = o.idMecanico || o.mecanicoId || (o.mecanico && o.mecanico.id);
          return Number(idMec) === Number(this.miIdUsuario);
        });
        
        this.misOrdenes.set(filtradas);
        this.cdr.detectChanges();
      },
      error: () => {
        // PLAN B: Si tus compañeros crearon un endpoint directo para el mecánico, probamos acá:
        this.http.get<any[]>('http://localhost:8080/api/ordenes/mis-ordenes', { headers: this.getHeaders() }).subscribe(res => {
          this.misOrdenes.set(res);
          this.cdr.detectChanges();
        });
      }
    });
  }

  comenzarService(ordenId: number) {
    this.http.patch(`http://localhost:8080/api/ordenes/${ordenId}/estado?estado=REALIZANDOSE_SERVICE`, null, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert("Orden actualizada: ¡Trabajando en la moto! ⚙️");
        this.cargarMisOrdenesDelBackend();
      }
    });
  }

  terminarService(ordenId: number) {
    this.http.patch(`http://localhost:8080/api/ordenes/${ordenId}/estado?estado=SERVICE_TERMINADO`, null, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert("¡Trabajo finalizado! El backend ha generado el PIN de seguridad de 6 dígitos.");
        this.cargarMisOrdenesDelBackend();
      }
    });
  }
}