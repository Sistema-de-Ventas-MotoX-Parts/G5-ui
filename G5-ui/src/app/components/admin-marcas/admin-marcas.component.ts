import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-marcas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    .admin-container {
      width: 100%;
      padding: 1.5rem 2rem;
      font-family: 'Inter', system-ui, sans-serif;
    }

    .header-container {
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #222;
      padding-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .title-section h2 {
      font-family: 'Oswald', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .title-section h2 span { color: #FACC15; }

    .title-sub {
      font-size: .85rem;
      color: #666;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin: 0.25rem 0 0 0;
    }

    .filters-row {
      display: flex;
      gap: .75rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-wrapper { flex: 1 1 260px; max-width: 360px; }
    .filter-select-wrapper { flex: 0 0 180px; }

    .search-input,
    .filter-select {
      width: 100%;
      background: #141414;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      padding: .7rem 1rem;
      font-size: .9rem;
      font-family: 'Inter', system-ui, sans-serif;
      transition: all 0.2s ease;
      appearance: none;
      -webkit-appearance: none;
    }
    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #FACC15;
      box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.15);
    }
    .filter-select option { background: #141414; color: #fff; }

    .count-badge {
      font-size: .85rem;
      font-weight: 600;
      color: #aaa;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
      white-space: nowrap;
    }
    .count-badge strong { color: #FACC15; }

    .table-wrapper {
      border: 1px solid #222;
      border-radius: 12px;
      overflow: hidden;
      background: #0d0d0d;
      width: 100%;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: .95rem;
      text-align: left;
      table-layout: fixed;
    }

    .admin-table thead { background: #050505; border-bottom: 2px solid #FACC15; }
    .admin-table th {
      color: #FACC15;
      padding: 0.75rem 1.5rem;
      font-size: .8rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: 'Oswald', sans-serif;
      white-space: nowrap;
    }
    .admin-table th:nth-child(1) { width: 50%; }
    .admin-table th:nth-child(2) { width: 20%; }
    .admin-table th:nth-child(3) { width: 30%; }

    .admin-table td {
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid #161616;
      color: #ccc;
      vertical-align: middle;
    }
    .admin-table tr:hover { background: #141414; }
    .admin-table tr:last-child td { border-bottom: none; }

    .badge {
      padding: .2rem .6rem;
      border-radius: 4px;
      font-size: .72rem;
      font-weight: 700;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: .3rem;
    }
    .badge-active   { background: rgba(74,222,128,0.1);  color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .badge-inactive { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
    .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .dot-on  { background: #4ade80; }
    .dot-off { background: #f87171; }

    .actions-cell { display: flex; gap: .5rem; align-items: center; justify-content: flex-end; }

    .btn { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; border: none; padding: .45rem 1.1rem; border-radius: 6px; cursor: pointer; transition: all .15s ease; font-size: .75rem; letter-spacing: .5px; white-space: nowrap; }
    .btn-primary     { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; transform: translateY(-1px); }
    .btn-edit        { background: transparent; color: #FACC15; border: 1px solid #332800; }
    .btn-edit:hover  { background: rgba(250,204,21,0.08); }
    .btn-toggle-off  { background: transparent; color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
    .btn-toggle-off:hover { background: rgba(248,113,113,0.08); }
    .btn-toggle-on   { background: transparent; color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .btn-toggle-on:hover  { background: rgba(74,222,128,0.08); }
    .btn-cancel      { background: #1a1a1a; color: #ccc; border: 1px solid #2a2a2a; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-content  { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 2rem; width: 100%; max-width: 450px; }

    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
    .form-group label { font-size: .75rem; font-weight: 600; color: #FACC15; text-transform: uppercase; letter-spacing: 1px; }
    .form-control { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; padding: .7rem .9rem; width: 100%; font-family: 'Inter', system-ui, sans-serif; font-size: .92rem; }
    .form-control:focus { outline: none; border-color: #FACC15; }

    .alert-error { padding: 1rem; border-radius: 8px; font-size: .9rem; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .empty, .loading { text-align: center; padding: 4rem 1rem; color: #666; font-size: 1rem; }
  `],
  template: `
    <div class="admin-container">

      <div class="header-container">
        <div class="top-row">
          <div class="title-section">
            <h2>Marcas de <span>Motos</span></h2>
            <p class="title-sub">Configuración base de fabricantes</p>
          </div>
          <button class="btn btn-primary" (click)="abrirCrear()">+ Nueva Marca</button>
        </div>

        <!-- Filtros -->
        <div class="filters-row">
          <div class="search-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar por nombre de marca..."
              [ngModel]="filtroNombre()"
              (ngModelChange)="filtroNombre.set($event)">
          </div>

          <div class="filter-select-wrapper">
            <select
              class="filter-select"
              [ngModel]="filtroEstado()"
              (ngModelChange)="filtroEstado.set($event)">
              <option value="">Todos los estados</option>
              <option value="activo">Activas</option>
              <option value="inactivo">Inactivas</option>
            </select>
          </div>

          <p class="count-badge">
            <strong>{{ marcasFiltradas().length }}</strong> marcas
          </p>
        </div>
      </div>

      <div class="table-wrapper" *ngIf="!cargando">
        <table class="admin-table" *ngIf="marcasFiltradas().length > 0">
          <thead>
            <tr>
              <th>Nombre del Fabricante</th>
              <th>Estado</th>
              <th style="text-align:right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of marcasFiltradas()">
              <td style="color:#fff; font-weight:600; font-size:1.05rem;">{{ m.nombre }}</td>
              <td>
                <span class="badge" [ngClass]="esMarcaActiva(m) ? 'badge-active' : 'badge-inactive'">
                  <span class="dot" [ngClass]="esMarcaActiva(m) ? 'dot-on' : 'dot-off'"></span>
                  {{ esMarcaActiva(m) ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button class="btn btn-edit" (click)="abrirEditar(m)">Editar</button>
                  <button class="btn"
                    [ngClass]="esMarcaActiva(m) ? 'btn-toggle-off' : 'btn-toggle-on'"
                    (click)="cambiarEstadoLogico(m)">
                    {{ esMarcaActiva(m) ? 'Desactivar' : 'Activar' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty" *ngIf="marcasFiltradas().length === 0">
          {{ filtroNombre() || filtroEstado()
            ? 'No se encontraron marcas con los filtros aplicados.'
            : 'No hay marcas configuradas.' }}
        </div>
      </div>

      <div class="loading" *ngIf="cargando">Cargando marcas...</div>
    </div>

    <!-- MODAL -->
    <div class="modal-backdrop" *ngIf="mostrarModal">
      <div class="modal-content">
        <h3 style="margin-top:0; font-size:1.4rem; color:white; font-family:'Oswald',sans-serif; text-transform:uppercase;">
          {{ modoEdit ? 'Editar' : 'Nueva' }} <span style="color:#FACC15;">Marca</span>
        </h3>
        <hr style="border-color:#1f1f1f; margin-bottom:1.5rem;">

        <div class="alert-error" *ngIf="errorMensaje">⚠️ {{ errorMensaje }}</div>

        <form (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Nombre de la Marca</label>
            <input type="text" class="form-control" [(ngModel)]="form.nombre" name="nombre" placeholder="Ej: Honda, Yamaha, Kawasaki...">
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:1.5rem; gap:.5rem;">
            <button type="button" class="btn btn-cancel" (click)="cerrarModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ modoEdit ? 'Guardar Cambios' : 'Registrar Marca' }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminMarcasComponent implements OnInit {
  marcas   = signal<any[]>([]);
  cargando     = false;
  mostrarModal = false;
  modoEdit     = false;
  errorMensaje = '';
  form = { id: null, nombre: '', activo: true };

  filtroNombre = signal<string>('');
  filtroEstado = signal<string>('');

  marcasFiltradas = computed(() => {
    const texto  = this.filtroNombre().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.marcas().filter(m => {
      const coincideNombre = !texto || m.nombre?.toLowerCase().includes(texto);
      const activa = this.esMarcaActiva(m);
      const coincideEstado = !estado
        || (estado === 'activo'   &&  activa)
        || (estado === 'inactivo' && !activa);
      return coincideNombre && coincideEstado;
    });
  });

  private http        = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr         = inject(ChangeDetectorRef);
  private apiUrl      = 'http://localhost:8080/api/marcas';

  private getHeaders() {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.obtenerToken()}` });
  }

  ngOnInit() { this.cargarMarcas(); }

  cargarMarcas() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: data => { this.marcas.set(data); this.cargando = false; this.cdr.detectChanges(); },
      error: ()  => { this.cargando = false; }
    });
  }

  abrirCrear() {
    this.modoEdit = false;
    this.errorMensaje = '';
    this.form = { id: null, nombre: '', activo: true };
    this.mostrarModal = true;
  }

  abrirEditar(marca: any) {
    this.modoEdit = true;
    this.errorMensaje = '';
    this.form = { ...marca, activo: this.esMarcaActiva(marca) };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; this.errorMensaje = ''; }

  guardar() {
    if (!this.form.nombre.trim()) {
      this.errorMensaje = 'El nombre de la marca es obligatorio.'; return;
    }
    if (this.modoEdit) {
      this.http.put(`${this.apiUrl}/${this.form.id}`, this.form, { headers: this.getHeaders() }).subscribe({
        next: () => { this.cargarMarcas(); this.cerrarModal(); }
      });
    } else {
      this.http.post(this.apiUrl, this.form, { headers: this.getHeaders() }).subscribe({
        next: () => { this.cerrarModal(); this.cargarMarcas(); }
      });
    }
  }

  esMarcaActiva(marca: any): boolean {
    const raw = localStorage.getItem('motos_marcas_estados');
    if (raw) {
      const tabla = JSON.parse(raw);
      if (tabla[marca.id] !== undefined) return tabla[marca.id];
    }
    return marca.activo !== false;
  }

  cambiarEstadoLogico(marca: any) {
    const nuevoEstado = !this.esMarcaActiva(marca);
    const raw   = localStorage.getItem('motos_marcas_estados') || '{}';
    const tabla = JSON.parse(raw);
    tabla[marca.id] = nuevoEstado;
    localStorage.setItem('motos_marcas_estados', JSON.stringify(tabla));

    this.http.put(`${this.apiUrl}/${marca.id}`, { ...marca, activo: nuevoEstado }, { headers: this.getHeaders() }).subscribe({
      next:  () => this.cargarMarcas(),
      error: () => this.cargarMarcas()
    });
  }
}
