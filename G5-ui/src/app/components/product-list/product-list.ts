import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/products';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],

  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap');

    /* ── MODAL OVERLAY ── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
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
      max-width: 560px;
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
      font-size: 1.1rem;
      font-weight: 700;
      color: #000;
      letter-spacing: .5px;
      margin: 0;
      font-family: 'Oswald', sans-serif;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 1.4rem;
      line-height: 1;
      cursor: pointer;
      color: #000;
      padding: 0 .25rem;
    }
    .modal-close:hover { opacity: .6; }

    .modal-body {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .75rem;
    }
    .modal-body input {
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      color: #f0f0f0;
      padding: .6rem .8rem;
      font-size: .875rem;
      transition: border-color .15s;
      width: 100%;
      box-sizing: border-box;
    }
    .modal-body input::placeholder { color: #666; }
    .modal-body input:focus {
      outline: none;
      border-color: #FACC15;
    }
    .modal-body input.span-full { grid-column: 1 / -1; }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #333;
      display: flex;
      justify-content: flex-end;
      gap: .75rem;
    }

    /* ── BUTTONS ── */
    .btn-primary {
      background: #FACC15;
      color: #000;
      font-weight: 700;
      font-size: .875rem;
      padding: .55rem 1.25rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      letter-spacing: .3px;
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

    /* ── PAGE ── */
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

    /* ── TABLE ── */
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
    thead tr {
      background: #000;
    }
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
    tbody td {
      color: #ccc;
      padding: .8rem 1rem;
    }
    .sku-badge {
      background: #2a2a2a;
      color: #FACC15;
      font-size: .75rem;
      font-weight: 600;
      padding: .2rem .5rem;
      border-radius: 4px;
      font-family: monospace;
    }
    .price-cell { color: #fff; font-weight: 600; }
    .stock-pill {
      display: inline-block;
      padding: .15rem .6rem;
      border-radius: 99px;
      font-size: .75rem;
      font-weight: 600;
    }
    .stock-ok  { background: #1a2e1a; color: #4ade80; }
    .stock-low { background: #2e1a1a; color: #f87171; }
    .product-img {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #333;
    }
    .img-placeholder {
      width: 48px;
      height: 48px;
      background: #222;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #555;
      font-size: .65rem;
    }

    /* ── EMPTY STATE ── */
    .empty-state {
      text-align: center;
      padding: 3.5rem 1rem;
    }
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: .75rem;
    }
    .empty-state p {
      color: #666;
      font-size: .9rem;
      margin: 0 0 1.25rem;
    }

    /* ── CATEGORY SEARCH ── */
    .category-search-wrapper {
      position: relative;
      grid-column: 1 / -1;
    }
    .category-search {
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 6px;
      color: #f0f0f0;
      padding: .6rem .8rem;
      font-size: .875rem;
      transition: border-color .15s;
      width: 100%;
      box-sizing: border-box;
    }
    .category-search:focus {
      outline: none;
      border-color: #FACC15;
    }
    .category-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #2a2a2a;
      border: 1px solid #FACC15;
      border-top: none;
      border-radius: 0 0 6px 6px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
    }
    .category-option {
      padding: .6rem .8rem;
      cursor: pointer;
      color: #f0f0f0;
      border-bottom: 1px solid #1f1f1f;
      transition: background .1s;
    }
    .category-option:last-child { border-bottom: none; }
    .category-option:hover { background: #1f1f1f; color: #FACC15; }
    .category-option.active { background: #FACC15; color: #000; font-weight: 600; }
  `],

  template: `

<!-- ══════════════════ MODAL ══════════════════ -->
<div class="modal-overlay" *ngIf="modalAbierto()" (click)="cerrarModal($event)">
  <div class="modal-card">

    <div class="modal-header">
      <h3>Nuevo producto</h3>
      <button class="modal-close" (click)="modalAbierto.set(false)">✕</button>
    </div>

    <div class="modal-body">
      <input
        placeholder="Código SKU *"
        [(ngModel)]="nuevoProducto.codigoSku">

      <input
        placeholder="Nombre *"
        [(ngModel)]="nuevoProducto.nombre">

      <input
        class="span-full"
        placeholder="Descripción"
        [(ngModel)]="nuevoProducto.descripcion">

      <input
        type="number"
        placeholder="Precio"
        [(ngModel)]="nuevoProducto.precio">

      <input
        type="number"
        placeholder="Stock"
        [(ngModel)]="nuevoProducto.stock">

      <input
        class="span-full"
        placeholder="URL Imagen"
        [(ngModel)]="nuevoProducto.imagenUrl">

      <div class="category-search-wrapper">
        <input
          class="category-search"
          type="text"
          placeholder="Buscar categoría *"
          [(ngModel)]="categoriaBuscada"
          (input)="filtrarCategorias()"
          (focus)="mostrarDropdownCategorias = true"
          (blur)="ocultarDropdown()">
        <div class="category-dropdown" *ngIf="mostrarDropdownCategorias && categoriasFiltradas().length > 0">
          <div class="category-option"
            *ngFor="let cat of categoriasFiltradas()"
            [class.active]="nuevoProducto.categoria.id === cat.id"
            (click)="seleccionarCategoria(cat)">
            {{cat.nombre}}
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-ghost" (click)="modalAbierto.set(false)" [disabled]="cargando()">Cancelar</button>
      <button class="btn-primary" (click)="guardarProducto()" [disabled]="cargando()">{{cargando() ? 'Cargando...' : 'Guardar producto'}}</button>
    </div>

  </div>
</div>

<!-- ══════════════════ PÁGINA ══════════════════ -->
<div class="page-wrapper">

  <div class="page-header">
    <h2 class="page-title">Gestión de <span>Productos</span></h2>
    <button class="btn-primary" (click)="abrirModalNuevoProducto()">+ Nuevo producto</button>
  </div>

  <!-- Tabla -->
  <div *ngIf="products().length > 0; else noProducts" class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>SKU</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of products()">
          <td>
            <img *ngIf="p.imagenUrl; else noImg" [src]="p.imagenUrl" class="product-img" [alt]="p.nombre">
            <ng-template #noImg>
              <div class="img-placeholder">sin img</div>
            </ng-template>
          </td>
          <td><span class="sku-badge">{{p.codigoSku}}</span></td>
          <td>{{p.nombre}}</td>
          <td>{{p.descripcion}}</td>
          <td class="price-cell">$ {{p.precio}}</td>
          <td>
            <span class="stock-pill" [class.stock-ok]="p.stock > 5" [class.stock-low]="p.stock <= 5">
              {{p.stock}}
            </span>
          </td>
          <td>{{p.categoria?.nombre || '—'}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Empty state -->
  <ng-template #noProducts>
    <div class="empty-state">
      <div class="empty-icon">—</div>
      <p>Todavía no hay productos. Usá el botón de arriba para crear el primero.</p>
    </div>
  </ng-template>

</div>
  `
})
export class ProductListComponent implements OnInit {

  products = signal<Product[]>([]);
  categorias = signal<Category[]>([]);
  categoriasFiltradas = signal<Category[]>([]);
  modalAbierto = signal(false);
  mostrarDropdownCategorias = false;
  categoriaBuscada = '';
  cargando = signal(false);

  nuevoProducto: Product = {
    codigoSku: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoria: { id: 0, nombre: '' },
    activo: true
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        console.log('Categorías recibidas:', data);
        this.categorias.set(data);
        this.categoriasFiltradas.set(data);
      },
      error: (err: any) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  cargarProductos(): void {
    console.log('Iniciando carga de productos...');
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        console.log('Productos recibidos:', data);
        this.products.set(data);
      },
      error: (err: any) => {
        console.error('Error cargando productos:', err);
      }
    });
  }

  cerrarModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.modalAbierto.set(false);
    }
  }

  abrirModalNuevoProducto(): void {
    this.resetearFormulario();
    this.modalAbierto.set(true);
    this.filtrarCategorias();
  }

  filtrarCategorias(): void {
    if (this.categoriaBuscada.trim() === '') {
      this.categoriasFiltradas.set(this.categorias());
    } else {
      this.categoriasFiltradas.set(this.categorias().filter(c =>
        c.nombre.toLowerCase().includes(this.categoriaBuscada.toLowerCase())
      ));
    }
  }

  seleccionarCategoria(categoria: Category): void {
    this.nuevoProducto.categoria = categoria;
    this.categoriaBuscada = categoria.nombre;
    this.mostrarDropdownCategorias = false;
    this.categoriasFiltradas.set([]);
  }

  ocultarDropdown(): void {
    setTimeout(() => {
      this.mostrarDropdownCategorias = false;
    }, 150);
  }

  guardarProducto(): void {
    if (!this.nuevoProducto.codigoSku || !this.nuevoProducto.nombre) {
      alert('Por favor completa los campos requeridos (SKU y Nombre)');
      return;
    }
    if (!this.nuevoProducto.categoria.id) {
      alert('Por favor selecciona una categoría');
      return;
    }

    this.cargando.set(true);
    this.productService.createProduct(this.nuevoProducto).subscribe({
      next: (producto: Product) => {
        console.log('Producto guardado:', producto);
        this.products.update(p => [...p, producto]);
        this.modalAbierto.set(false);
        this.cargando.set(false);
        this.resetearFormulario();
      },
      error: (err: any) => {
        this.cargando.set(false);
        console.error('Error guardando producto:', err);
        alert('Error al guardar el producto');
      }
    });
  }

  resetearFormulario(): void {
    this.nuevoProducto = {
      codigoSku: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagenUrl: '',
      categoria: { id: 0, nombre: '' },
      activo: true
    };
    this.categoriaBuscada = '';
    this.mostrarDropdownCategorias = false;
  }
}