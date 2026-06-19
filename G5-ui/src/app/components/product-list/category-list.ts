import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],

  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap');

    .page-wrapper {
      background: #000;
      min-height: 100vh;
      padding: 2rem;
      font-family: 'Oswald', system-ui, sans-serif;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: .5px;
      font-family: 'Oswald', sans-serif;
    }
    .page-title span { color: #FACC15; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.65);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn .15s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    .modal-card {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 12px;
      width: 100%;
      max-width: 420px;
      margin: 1rem;
      overflow: hidden;
      animation: slideUp .2s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0 }
      to   { transform: translateY(0);    opacity: 1 }
    }

    .modal-header {
      background: #FACC15;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-header h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #000;
      margin: 0;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 1.3rem;
      cursor: pointer;
      color: #000;
      line-height: 1;
    }
    .modal-close:hover { opacity: .6; }

    .modal-body {
      padding: 1.5rem;
    }
    .modal-body input {
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      color: #f0f0f0;
      padding: .65rem .8rem;
      font-size: .875rem;
      width: 100%;
      box-sizing: border-box;
      transition: border-color .15s;
    }
    .modal-body input::placeholder { color: #666; }
    .modal-body input:focus { outline: none; border-color: #FACC15; }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #333;
      display: flex;
      justify-content: flex-end;
      gap: .75rem;
    }

    /* Buttons */
    .btn-primary {
      background: #FACC15;
      color: #000;
      font-weight: 700;
      font-size: .875rem;
      padding: .55rem 1.25rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background .15s;
    }
    .btn-primary:hover { background: #EAB308; }

    .btn-ghost {
      background: transparent;
      color: #aaa;
      font-size: .875rem;
      padding: .55rem 1rem;
      border: 1px solid #444;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color .15s, color .15s;
    }
    .btn-ghost:hover { border-color: #888; color: #fff; }

    /* Table */
    .table-wrapper {
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: .875rem;
    }
    thead tr { background: #000; }
    thead th {
      color: #FACC15;
      font-weight: 600;
      text-transform: uppercase;
      font-size: .75rem;
      letter-spacing: .8px;
      padding: .9rem 1rem;
      text-align: left;
    }
    tbody tr {
      border-bottom: 1px solid #1f1f1f;
      transition: background .1s;
    }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: #1a1a1a; }
    tbody td { color: #ccc; padding: .8rem 1rem; }

    .id-badge {
      background: #2a2a2a;
      color: #FACC15;
      font-size: .75rem;
      font-weight: 600;
      padding: .2rem .5rem;
      border-radius: 4px;
      font-family: monospace;
    }

    .actions-cell {
      display: flex;
      gap: .5rem;
    }

    .btn-edit, .btn-delete {
      padding: .35rem .65rem;
      border: none;
      border-radius: 4px;
      font-size: .75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .15s;
    }

    .btn-edit {
      background: #FACC15;
      color: #000;
    }
    .btn-edit:hover { background: #EAB308; }

    .btn-delete {
      background: #333;
      color: #f87171;
    }
    .btn-delete:hover { background: #444; }

    /* Empty */
    .empty-state {
      text-align: center;
      padding: 3.5rem 1rem;
    }
    .empty-icon { font-size: 2.5rem; margin-bottom: .75rem; }
    .empty-state p { color: #666; font-size: .9rem; margin: 0; }
  `],

  template: `

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="modalAbierto" (click)="cerrarOverlay($event)">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ editando ? 'Editar categoría' : 'Nueva categoría' }}</h3>
          <button class="modal-close" (click)="cerrarModal()">✕</button>
        </div>
        <div class="modal-body">
          <input
            placeholder="Nombre de la categoría *"
            [(ngModel)]="nueva.nombre">
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" (click)="cerrarModal()">Cancelar</button>
          <button class="btn-primary" (click)="guardar()">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        </div>
      </div>
    </div>

    <!-- Página -->
    <div class="page-wrapper">

      <div class="page-header">
        <h2 class="page-title">Gestión de <span>Categorías</span></h2>
        <button class="btn-primary" (click)="abrirModalNuevaCategoria()">+ Nueva categoría</button>
      </div>

      <div *ngIf="categorias && categorias.length > 0; else noData" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of categorias">
              <td><span class="id-badge">#{{c.id}}</span></td>
              <td>{{c.nombre}}</td>
              <td class="actions-cell">
                <button class="btn-edit" (click)="editar(c)">Editar</button>
                <button class="btn-delete" (click)="eliminar(c.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noData>
        <div class="empty-state">
          <div class="empty-icon">—</div>
          <p>Todavía no hay categorías. Usá el botón de arriba para crear la primera.</p>
        </div>
      </ng-template>

    </div>
  `
})
export class CategoryListComponent implements OnInit {

  categorias: Category[] = [];
  modalAbierto = false;
  editando = false;
  categoriaEditandoId?: number;

  nueva: Category = { nombre: '' };

  constructor(private service: CategoryService) {}

  ngOnInit() {
    this.cargar();
  }

  abrirModalNuevaCategoria() {
    this.modalAbierto = true;
    this.editando = false;
    this.categoriaEditandoId = undefined;
    this.nueva = { nombre: '' };
  }

  cerrarOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrarModal();
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.editando = false;
    this.categoriaEditandoId = undefined;
    this.nueva = { nombre: '' };
  }

  cargar() {
    this.service.getCategories().subscribe({
      next: data => { this.categorias = data; }
    });
  }

  guardar() {
    if (!this.nueva.nombre.trim()) {
      alert('Por favor ingresá un nombre de categoría');
      return;
    }

    if (this.editando && this.categoriaEditandoId != null) {
      this.service.updateCategory(this.categoriaEditandoId, this.nueva).subscribe({
        next: (categoria) => {
          this.categorias = this.categorias.map(c => c.id === categoria.id ? categoria : c);
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error actualizando categoría:', err);
          alert('Error al actualizar la categoría');
        }
      });
      return;
    }

    this.service.createCategory(this.nueva).subscribe({
      next: (categoria) => {
        this.categorias = [...this.categorias, categoria];
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error guardando categoría:', err);
        alert('Error al guardar la categoría');
      }
    });
  }

  editar(categoria: Category) {
    this.modalAbierto = true;
    this.editando = true;
    this.categoriaEditandoId = categoria.id;
    this.nueva = { ...categoria };
  }

  eliminar(id?: number) {
    if (!id) return;

    const confirmado = confirm('¿Querés eliminar esta categoría?');
    if (!confirmado) return;

    this.service.deleteCategory(id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.id !== id);
      },
      error: (err) => {
        console.error('Error eliminando categoría:', err);
        alert('Error al eliminar la categoría');
      }
    });
  }
}