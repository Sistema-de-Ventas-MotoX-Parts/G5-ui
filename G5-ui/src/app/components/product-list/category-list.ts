import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    .admin-container {
      max-width: 820px;
      margin: 1.5rem auto;
      padding: 1rem;
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
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .title-section h2 span { color: #FACC15; }

    .title-sub {
      font-size: .82rem;
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

    .search-wrapper { flex: 1 1 200px; }

    .search-input {
      width: 100%;
      background: #141414;
      border: 1px solid #333;
      border-radius: 6px;
      color: #fff;
      padding: .65rem 1rem;
      font-size: .9rem;
      transition: all 0.2s ease;
    }
    .search-input:focus {
      outline: none;
      border-color: #FACC15;
      box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.15);
    }

    .count-badge {
      font-size: .82rem;
      font-weight: 600;
      color: #aaa;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
      white-space: nowrap;
    }
    .count-badge strong { color: #FACC15; }

    /* --- RESPONSIVE TABLE / CARDS SYSTEM --- */
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
      font-size: .92rem;
      text-align: left;
      display: table;
    }

    .admin-table thead tr { background: #050505; border-bottom: 2px solid #FACC15; }
    .admin-table th {
      color: #FACC15;
      padding: 0.75rem 1.25rem;
      font-size: .78rem;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: 'Oswald', sans-serif;
    }

    .admin-table td {
      color: #bbb;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid #161616;
      vertical-align: middle;
    }
    .admin-table tr:hover { background: #141414; }

    /* Vista de Tarjetas (Oculta por defecto en Desktop) */
    .responsive-cards {
      display: none;
      flex-direction: column;
      gap: 1rem;
      padding: 0.5rem;
    }

    .category-card {
      background: #111;
      border: 1px solid #222;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-body {
      font-size: 1.1rem;
      color: #e5e5e5;
      font-weight: 500;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .card-actions .btn {
      flex: 1;
      text-align: center;
    }

    /* --- MEDIA QUERIES --- */
    @media (max-width: 600px) {
      .admin-table { display: none; } /* Escondemos la tabla */
      .responsive-cards { display: flex; } /* Mostramos las tarjetas */

      .top-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .btn-primary { width: 100%; text-align: center; }
      .filters-row { width: 100%; }
    }

    /* --- COMPONENTES COMUNES --- */
    .id-badge {
      display: inline-flex;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #FACC15;
      font-size: .7rem;
      font-weight: 700;
      padding: .2rem .5rem;
      border-radius: 4px;
      font-family: monospace;
    }

    .badge-estado {
      display: inline-flex;
      align-items: center;
      gap: .35rem;
      padding: .25rem .65rem;
      border-radius: 4px;
      font-size: .72rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-activo   { background: rgba(74,222,128,0.1);  color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .badge-inactivo { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }

    .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .dot-activo   { background: #4ade80; }
    .dot-inactivo { background: #f87171; }

    .actions-cell { display: flex; gap: .5rem; align-items: center; }

    .btn { font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase; border: none; padding: .55rem 1.1rem; border-radius: 5px; cursor: pointer; transition: all .15s; font-size: .75rem; letter-spacing: 0.5px; white-space: nowrap; }
    .btn-primary    { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; }
    .btn-edit       { background: transparent; color: #FACC15; border: 1px solid #332800; }
    .btn-edit:hover { background: rgba(250,204,21,0.08); }
    .btn-activar    { background: transparent; color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
    .btn-activar:hover    { background: rgba(74,222,128,0.08); }
    .btn-desactivar { background: transparent; color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
    .btn-desactivar:hover { background: rgba(248,113,113,0.08); }
    .btn-cancel     { background: #1a1a1a; color: #ccc; border: 1px solid #2a2a2a; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-content  { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 2rem; width: 100%; max-width: 440px; }

    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
    .form-group label { font-size: .75rem; font-weight: 600; color: #FACC15; letter-spacing: 1px; text-transform: uppercase; }
    .form-control { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; font-size: .92rem; padding: .65rem .9rem; width: 100%; }
    .form-control:focus { outline: none; border-color: #FACC15; }

    .alert-error   { padding: .9rem; border-radius: 8px; font-size: .88rem; background: rgba(239,68,68,0.1);  border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .alert-success { padding: .9rem; border-radius: 8px; font-size: .88rem; background: rgba(74,222,128,0.1); border: 1px solid #4ade80; color: #4ade80; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: .5px; }

    .empty-state { text-align: center; padding: 4rem 1rem; }
    .empty-state p { color: #444; font-size: .88rem; margin: 0; }
  `],
  template: `
    <div class="admin-container">

      <div class="header-container">
        <div class="top-row">
          <div class="title-section">
            <h2>Gestión de <span>Categorías</span></h2>
            <p class="title-sub">Administrá las categorías del catálogo</p>
          </div>
          <button class="btn btn-primary" (click)="abrirModalNuevaCategoria()">+ Nueva Categoría</button>
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar por nombre..."
              [ngModel]="filtroNombre()"
              (ngModelChange)="filtroNombre.set($event)">
          </div>
          <p class="count-badge">
            <strong>{{ categoriasFiltradas().length }}</strong> categorías
          </p>
        </div>
      </div>

      <div class="alert-success" *ngIf="mensajeExito"> {{ mensajeExito }}</div>
      <div class="alert-error"   *ngIf="errorLista"> {{ errorLista }}</div>

      <div class="table-wrapper" *ngIf="categoriasFiltradas().length > 0">

        <table class="admin-table">
          <thead>
            <tr>
              <th style="width: 45%">Nombre</th>
              <th style="width: 20%">Estado</th>
              <th style="width: 20%">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of categoriasFiltradas()">
              <td style="color: #e5e5e5; font-weight: 500;">{{ c.nombre }}</td>
              <td>
                <span class="badge-estado" [ngClass]="c.activo !== false ? 'badge-activo' : 'badge-inactivo'">
                  <span class="dot" [ngClass]="c.activo !== false ? 'dot-activo' : 'dot-inactivo'"></span>
                  {{ c.activo !== false ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button class="btn btn-edit" (click)="editar(c)">Editar</button>
                  <button class="btn" [ngClass]="c.activo !== false ? 'btn-desactivar' : 'btn-activar'" (click)="toggleEstado(c)">
                    {{ c.activo !== false ? 'Desactivar' : 'Activar' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="responsive-cards">
          <div class="category-card" *ngFor="let c of categoriasFiltradas()">
            <div class="card-header">
              <span class="id-badge">#{{ c.id }}</span>
              <span class="badge-estado" [ngClass]="c.activo !== false ? 'badge-activo' : 'badge-inactivo'">
                <span class="dot" [ngClass]="c.activo !== false ? 'dot-activo' : 'dot-inactivo'"></span>
                {{ c.activo !== false ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="card-body">
              {{ c.nombre }}
            </div>
            <div class="card-actions">
              <button class="btn btn-edit" (click)="editar(c)">Editar</button>
              <button class="btn" [ngClass]="c.activo !== false ? 'btn-desactivar' : 'btn-activar'" (click)="toggleEstado(c)">
                {{ c.activo !== false ? 'Desactivar' : 'Activar' }}
              </button>
            </div>
          </div>
        </div>

      </div>

      <div *ngIf="categoriasFiltradas().length === 0" class="table-wrapper">
        <div class="empty-state">
          <p>{{ filtroNombre() ? 'No se encontraron categorías con ese nombre.' : 'Todavía no hay categorías registradas.' }}</p>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="modalAbierto()" (click)="cerrarOverlay($event)">
      <div class="modal-content">
        <h3 style="margin-top:0; font-size:1.4rem; color:white; text-transform:uppercase;">
          {{ editando ? 'Editar' : 'Nueva' }} <span style="color:#FACC15;">Categoría</span>
        </h3>
        <hr style="border-color:#1f1f1f; margin-bottom:1.5rem;">

        <div class="alert-error" *ngIf="errorModal">{{ errorModal }}</div>

        <form (ngSubmit)="guardar()">
          <div class="form-group">
            <label>Nombre de la Categoría</label>
            <input
              type="text"
              class="form-control"
              placeholder="Ej: Frenos, Motor..."
              [(ngModel)]="nueva.nombre"
              name="nombre">
          </div>
          <div style="display:flex; justify-content:flex-end; margin-top:1.5rem; gap:.5rem;">
            <button type="button" class="btn btn-cancel" (click)="cerrarModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CategoryListComponent implements OnInit {

  categorias   = signal<Category[]>([]);
  modalAbierto = signal(false);
  editando     = false;
  categoriaEditandoId?: number;

  mensajeExito = '';
  errorLista   = '';
  errorModal   = '';

  nueva: Category = { nombre: '', activo: true }; // Inicializamos activo por defecto
  filtroNombre = signal<string>('');

  categoriasFiltradas = computed(() => {
    const texto = this.filtroNombre().trim().toLowerCase();
    if (!texto) return this.categorias();
    return this.categorias().filter(c => c.nombre?.toLowerCase().includes(texto));
  });

  private service = inject(CategoryService);

  ngOnInit() { this.cargar(); }

  abrirModalNuevaCategoria() {
    this.modalAbierto.set(true);
    this.editando = false;
    this.errorModal = '';
    this.categoriaEditandoId = undefined;
    this.nueva = { nombre: '', activo: true };
  }

  cerrarOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) this.cerrarModal();
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.editando = false;
    this.errorModal = '';
    this.categoriaEditandoId = undefined;
    this.nueva = { nombre: '', activo: true };
  }

  cargar() {
    this.errorLista = '';
    this.service.getCategories().subscribe({
      next: data => this.categorias.set(data),
      error: (err: any) => { this.errorLista = 'No se pudieron recuperar las categorías.'; console.error(err); }
    });
  }

  guardar() {
    this.errorModal = '';
    if (!this.nueva.nombre.trim()) {
      this.errorModal = 'Por favor ingresá un nombre válido para la categoría.';
      return;
    }

    if (this.editando && this.categoriaEditandoId != null) {
      this.service.updateCategory(this.categoriaEditandoId, this.nueva).subscribe({
        next: cat => {
          this.categorias.update(cats => cats.map(c => c.id === cat.id ? cat : c));
          this.cerrarModal();
          this.mostrarExito('Categoría actualizada correctamente.');
        },
        error: (err: any) => this.errorModal = err.error?.error || 'Error al actualizar la categoría.'
      });
      return;
    }

    this.service.createCategory(this.nueva).subscribe({
      next: cat => {
        this.categorias.update(cats => [...cats, cat]);
        this.cerrarModal();
        this.mostrarExito('Nueva categoría guardada con éxito.');
      },
      error: (err: any) => this.errorModal = err.error?.error || 'Error al guardar la categoría.'
    });
  }

  editar(categoria: Category) {
    this.modalAbierto.set(true);
    this.editando = true;
    this.errorModal = '';
    this.categoriaEditandoId = categoria.id;
    this.nueva = { ...categoria };
  }

toggleEstado(categoria: Category) {
  const estabaActivo = categoria.activo !== false;

  if (estabaActivo) {
    // 1. Si estaba ACTIVO, probamos mandando un DELETE para ver si el backend hace la baja lógica
    this.service.deleteCategory(categoria.id!).subscribe({
      next: () => {
        this.categorias.update(cats => cats.map(c =>
          c.id === categoria.id ? { ...c, activo: false } : c
        ));
        this.mostrarExito('Categoría desactivada.');
      },
      error: (err: any) => {
        this.errorLista = 'No se pudo desactivar la categoría.';
        console.error(err);
      }
    });
  } else {
    // 2. Si estaba INACTIVO, usamos el PUT normal pasando activo: true para reactivarla
    const actualizado = { ...categoria, activo: true };
    this.service.updateCategory(categoria.id!, actualizado).subscribe({
      next: () => {
        this.categorias.update(cats => cats.map(c =>
          c.id === categoria.id ? { ...c, activo: true } : c
        ));
        this.mostrarExito('Categoría activada.');
      },
      error: (err: any) => {
        this.errorLista = 'No se pudo activar la categoría.';
        console.error(err);
      }
    });
  }
}

  private mostrarExito(msg: string) {
    this.mensajeExito = msg;
    setTimeout(() => this.mensajeExito = '', 3000);
  }
}
