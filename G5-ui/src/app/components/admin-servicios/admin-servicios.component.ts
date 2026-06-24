import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-admin-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght=400;600;700&family=Inter:wght=400;500;600&display=swap');

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

    .search-wrapper {
      position: relative;
      flex: 1 1 260px;
      max-width: 360px;
    }

    .filter-select-wrapper {
      flex: 0 0 200px;
    }

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

    .admin-table thead { display: none; }
    .admin-table tr { display: block; border-bottom: 1px solid #222; padding: 1.25rem 1rem; background: #0d0d0d; }
    
    /* MODIFICADO: Alineación flexible para celdas móviles */
    .admin-table td { display: flex; justify-content: space-between; align-items: center; padding: .5rem 0; color: #ccc; border: none; }
    .admin-table td::before { content: attr(data-label); font-weight: 600; color: #777; font-size: .8rem; text-transform: uppercase; }

    /* NUEVO: Contenedor específico para forzar que los botones estén alineados uno al lado del otro siempre */
    .botones-acciones {
      display: flex; /* Cambiado de inline-flex a flex */
      gap: 0.5rem;
      align-items: center;
      width: 100%;
    }

    @media (min-width: 992px) {
      .admin-table { display: table; }
      .admin-table thead { display: table-header-group; background: #050505; border-bottom: 2px solid #FACC15; }
      .admin-table tr { display: table-row; background: transparent; padding: 0; }
      .admin-table tr:hover { background: #141414; }
      .admin-table th {
        display: table-cell;
        color: #FACC15;
        padding: 1.2rem 1.5rem;
        font-size: .8rem;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-family: 'Oswald', sans-serif;
        white-space: nowrap;
      }
     /* 🌟 ANCHOS CORREGIDOS: Le bajamos a la descripción y subimos las acciones */
      .admin-table th:nth-child(1) { width: 25%; } /* Nombre */
      .admin-table th:nth-child(2) { width: 30%; } /* Descripción */
      .admin-table th:nth-child(3) { width: 15%; } /* Precio */
      .admin-table th:nth-child(4) { width: 10%; } /* Estado */
      .admin-table th:nth-child(5) { width: 20%; } /* 🚨 Subimos de 10% a 20% para que entren ambos botones */

      .admin-table td { display: table-cell; padding: 1.2rem 1.5rem; border-bottom: 1px solid #161616; vertical-align: middle; }
      .admin-table td::before { display: none; }
      .admin-table tr:last-child td { border-bottom: none; }
    }

    /* BOTONES */
    .btn { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; border: none; padding: .65rem 1.5rem; border-radius: 6px; cursor: pointer; transition: all .15s ease; font-size: .85rem; letter-spacing: 0.5px; white-space: nowrap; }
    .btn-primary { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; transform: translateY(-1px); }
    .btn-edit { background: transparent; color: #FACC15; border: 1px solid #332800; padding: .45rem 1.1rem; }
    .btn-edit:hover { background: rgba(250,204,21,0.08); }
    
    .btn-toggle-off { background: transparent; color: #f87171; border: 1px solid #3a1f1f; padding: .45rem 1.1rem; }
    .btn-toggle-off:hover { background: rgba(248,113,113,0.08); }
    .btn-toggle-on { background: transparent; color: #4ade80; border: 1px solid #14532d; padding: .45rem 1.1rem; }
    .btn-toggle-on:hover { background: rgba(74,222,128,0.08); }
    
    .btn-cancel { background: #1a1a1a; color: #ccc; border: 1px solid #2a2a2a; }

    .badge { padding: .2rem .5rem; border-radius: 4px; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
    .badge-active { background: rgba(74,222,128,0.15); color: #4ade80; }
    .badge-inactive { background: rgba(239,68,68,0.15); color: #f87171; }

    /* MODALES */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-content { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 2rem; width: 100%; max-width: 500px; }

    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
    .form-group label { font-size: .75rem; font-weight: 600; color: #FACC15; letter-spacing: 1px; text-transform: uppercase; }
    .form-control { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; font-size: .95rem; padding: .7rem .9rem; width: 100%; font-family: 'Inter', system-ui, sans-serif; }
    .form-control:focus { outline: none; border-color: #FACC15; }

    .alert-error { padding: 1rem; border-radius: 8px; font-size: 0.9rem; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .empty-state { text-align: center; padding: 4rem 1rem; color: #666; font-size: 1rem; }

    .badge-precio { display: inline-block; background: rgba(250,204,21,0.08); color: #FACC15; border: 1px solid rgba(250,204,21,0.2); padding: .2rem .6rem; border-radius: 4px; font-size: .9rem; font-weight: 700; }
  `],
  template: `
    <div class="admin-container">

      <div class="header-container">
        <div class="top-row">
          <div class="title-section">
            <h2>Gestión de <span>Servicios de Taller</span></h2>
            <p class="title-sub">Administrá los servicios del taller</p>
          </div>
          <button class="btn btn-primary" (click)="abrirModalCrear()">+ Nuevo Servicio</button>
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar servicio por nombre..."
              [ngModel]="filtroNombre()"
              (ngModelChange)="filtroNombre.set($event)">
          </div>

          <div class="filter-select-wrapper">
            <select
              class="filter-select"
              [ngModel]="filtroPrecio()"
              (ngModelChange)="filtroPrecio.set($event)">
              <option value="">Todos los precios</option>
              <option value="0-5000">Hasta $5.000</option>
              <option value="5000-15000">$5.000 – $15.000</option>
              <option value="15000-30000">$15.000 – $30.000</option>
              <option value="30000+">Más de $30.000</option>
            </select>
          </div>
        </div>
      </div>

      <div class="alert-error" *ngIf="errorLista">{{ errorLista }}</div>

      <div class="table-wrapper">
        <table class="admin-table" *ngIf="serviciosFiltrados().length > 0">
          <thead>
            <tr>
              <th>Nombre del Servicio</th>
              <th>Descripción</th>
              <th>Precio Base</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let serv of serviciosFiltrados()">
              <td data-label="Nombre" style="color:#fff; font-weight:600; font-size:1.05rem;">{{ serv.nombre }}</td>
              <td data-label="Descripción" style="color:#aaa;">{{ serv.descripcion || 'Sin descripción' }}</td>
              <td data-label="Precio Base">
                <span class="badge-precio">$ {{ serv.precioBase | number:'1.0-0' }}</span>
              </td>
              
              <td data-label="Estado">
                <span class="badge" [ngClass]="esServicioActivo(serv) ? 'badge-active' : 'badge-inactive'">
                  {{ esServicioActivo(serv) ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <td data-label="Acciones">
                <div class="botones-acciones">
                  <button class="btn btn-edit" (click)="abrirModalEditar(serv)">Editar</button>
                  
                  <button class="btn" 
                          [ngClass]="esServicioActivo(serv) ? 'btn-toggle-off' : 'btn-toggle-on'"
                          (click)="cambiarEstadoLogico(serv)">
                    {{ esServicioActivo(serv) ? 'Desactivar' : 'Activar' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="serviciosFiltrados().length === 0" class="empty-state">
          {{ filtroNombre() || filtroPrecio()
            ? 'No se encontraron servicios con los filtros aplicados.'
            : 'No hay servicios registrados en el sistema actualmente.' }}
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="mostrarModal">
      <div class="modal-content">
        <h3 style="margin-top:0; font-size:1.4rem; color:white; text-transform:uppercase;">
          {{ modoEdit ? 'Editar' : 'Nuevo' }} <span style="color:#FACC15;">Servicio</span>
        </h3>
        <hr style="border-color:#1f1f1f; margin-bottom:1.5rem;">

        <div class="alert-error" *ngIf="errorModal">{{ errorModal }}</div>

        <form (ngSubmit)="guardarServicio()">
          <div class="form-group">
            <label>Nombre del Servicio</label>
            <input type="text" class="form-control" [(ngModel)]="servicioForm.nombre" name="nombre" placeholder="Ej. Cambio de Aceite y Filtro">
          </div>
          <div class="form-group">
            <label>Descripción detallada</label>
            <textarea class="form-control" rows="3" [(ngModel)]="servicioForm.descripcion" name="descripcion" placeholder="Explique en qué consiste el servicio..."></textarea>
          </div>
          <div class="form-group">
            <label>Precio Base ($)</label>
            <input type="number" class="form-control" [(ngModel)]="servicioForm.precioBase" name="precioBase" placeholder="0.00">
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:1.5rem; gap:.5rem;">
            <button type="button" class="btn btn-cancel" (click)="cerrarModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">
              {{ modoEdit ? 'Guardar Cambios' : 'Registrar Servicio' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminServiciosComponent implements OnInit {
  servicios = signal<any[]>([]);
  mostrarModal = false;
  modoEdit = false;
  idServicioSeleccionado: number | null = null;
  errorLista = '';
  errorModal = '';

  filtroNombre = signal<string>('');
  filtroPrecio = signal<string>('');

  serviciosFiltrados = computed(() => {
    const texto = this.filtroNombre().trim().toLowerCase();
    const rango = this.filtroPrecio();

    return this.servicios().filter(s => {
      const coincideNombre = !texto || s.nombre?.toLowerCase().includes(texto);

      let coincidePrecio = true;
      if (rango) {
        const precio = s.precioBase ?? 0;
        if (rango === '0-5000')         coincidePrecio = precio <= 5000;
        else if (rango === '5000-15000')  coincidePrecio = precio > 5000  && precio <= 15000;
        else if (rango === '15000-30000') coincidePrecio = precio > 15000 && precio <= 30000;
        else if (rango === '30000+')      coincidePrecio = precio > 30000;
      }

      return coincideNombre && coincidePrecio;
    });
  });

  servicioForm = { nombre: '', descripcion: '', precioBase: 0, activo: true };

  private servicioService = inject(ServicioService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() { this.cargarServicios(); }

  cargarServicios() {
    this.errorLista = '';
    this.servicioService.listarServicios().subscribe({
      next: (res: any[]) => {
        this.servicios.set(res);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorLista = 'No se pudieron recuperar los servicios. Verifique permisos o CORS.';
        console.error(err);
      }
    });
  }

  abrirModalCrear() {
    this.modoEdit = false;
    this.errorModal = '';
    this.idServicioSeleccionado = null;
    this.servicioForm = { nombre: '', descripcion: '', precioBase: 0, activo: true };
    this.mostrarModal = true;
  }

  abrirModalEditar(servicio: any) {
    this.modoEdit = true;
    this.errorModal = '';
    this.idServicioSeleccionado = servicio.id;
    this.servicioForm = {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      precioBase: servicio.precioBase,
      activo: this.esServicioActivo(servicio)
    };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }

  guardarServicio() {
    this.errorModal = '';
    if (!this.servicioForm.nombre?.trim()) { this.errorModal = 'El nombre del servicio es obligatorio.'; return; }
    if (!this.servicioForm.descripcion?.trim()) { this.errorModal = 'La descripción es obligatoria.'; return; }
    if (!this.servicioForm.precioBase || this.servicioForm.precioBase <= 0) { this.errorModal = 'El precio base debe ser mayor a cero.'; return; }

    const dtoPayload = {
      nombre: this.servicioForm.nombre.trim(),
      descripcion: this.servicioForm.descripcion.trim(),
      precioBase: Number(this.servicioForm.precioBase),
      activo: this.servicioForm.activo
    };

    if (this.modoEdit && this.idServicioSeleccionado !== null) {
      this.servicioService.actualizarServicio(this.idServicioSeleccionado, dtoPayload).subscribe({
        next: () => { this.cerrarModal(); this.cargarServicios(); },
        error: (err: any) => { this.errorModal = err.error?.error || 'Error al actualizar el servicio.'; }
      });
    } else {
      this.servicioService.crearServicio(dtoPayload).subscribe({
        next: () => { this.cerrarModal(); this.cargarServicios(); },
        error: (err: any) => { this.errorModal = err.error?.error || 'Error al crear el servicio.'; }
      });
    }
  }

  esServicioActivo(servicio: any): boolean {
    const estadosLocales = localStorage.getItem('motos_servicios_estados');
    if (estadosLocales) {
      const tablaEstados = JSON.parse(estadosLocales);
      if (tablaEstados[servicio.id] !== undefined) {
        return tablaEstados[servicio.id];
      }
    }
    return servicio.activo !== false;
  }

  cambiarEstadoLogico(servicio: any) {
    const estadoActual = this.esServicioActivo(servicio);
    const nuevoEstado = !estadoActual;

    const estadosLocales = localStorage.getItem('motos_servicios_estados') || '{}';
    const tablaEstados = JSON.parse(estadosLocales);
    tablaEstados[servicio.id] = nuevoEstado;
    localStorage.setItem('motos_servicios_estados', JSON.stringify(tablaEstados));

    const dtoPayload = {
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precioBase: Number(servicio.precioBase),
      activo: nuevoEstado
    };

    this.servicioService.actualizarServicio(servicio.id, dtoPayload).subscribe({
      next: () => this.cargarServicios(),
      error: (err: any) => {
        console.error('Error al actualizar estado lógico en el servidor:', err);
        this.cargarServicios();
      }
    });
  }
}