import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/products';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    /* 🌟 CONTENEDOR PRINCIPAL: Casi toca los costados */
    .admin-container {
      max-width: 98%;
      margin: 1.5rem auto;
      padding: 0 1rem;
      font-family: 'Inter', system-ui, sans-serif;
    }

    /* 🌟 CABECERA REESTRUCTURADA */
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
      font-size: 2.2rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .title-section h2 span { color: #FACC15; }

    .bottom-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .bottom-row {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .table-count {
      font-size: .85rem;
      font-weight: 600;
      color: #aaa;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
    }
    .table-count strong { color: #FACC15; font-size: 1rem; }

    /* 🔍 BUSCADOR ABAJO */
    .search-wrapper {
      position: relative;
      width: 100%;
    }
    @media (min-width: 768px) {
      .search-wrapper { width: 350px; }
    }

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
    }

    /* TABLA ULTRA ANCHA */
    .table-wrapper {
      border: 1px solid #222;
      border-radius: 12px;
      overflow: hidden;
      background: #0d0d0d;
      width: 100%;
    }

    .admin-table { width: 100%; border-collapse: collapse; font-size: .9rem; text-align: left; }
    .admin-table thead { display: none; }
    .admin-table tr { display: block; border-bottom: 1px solid #222; padding: 1rem; background: #0d0d0d; }
    .admin-table td { display: flex; justify-content: space-between; align-items: center; padding: .5rem 0; color: #ccc; border: none; }
    .admin-table td::before { content: attr(data-label); font-weight: 600; color: #777; font-size: .8rem; text-transform: uppercase; }

    @media (min-width: 992px) {
      .admin-table { display: table; }
      .admin-table thead { display: table-header-group; background: #050505; border-bottom: 2px solid #FACC15; }
      .admin-table tr { display: table-row; background: transparent; padding: 0; }
      .admin-table tr:hover { background: #141414; }
      .admin-table th { display: table-cell; color: #FACC15; padding: 1.1rem 1.25rem; font-size: .75rem; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Oswald', sans-serif; }
      .admin-table td { display: table-cell; padding: 1.1rem 1.25rem; border-bottom: 1px solid #161616; }
      .admin-table td::before { display: none; }
    }

    /* COMPONENTES VISUALES */
    .status-badge { display: inline-block; padding: .2rem .6rem; border-radius: 4px; font-size: .7rem; font-weight: bold; text-transform: uppercase; }
    .status-active { background: rgba(74, 222, 128, 0.1); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.2); }
    .status-inactive { background: rgba(248, 113, 113, 0.1); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.2); }

    .sku-badge { background: #1a1a1a; color: #FACC15; font-size: .8rem; padding: .25rem .6rem; border-radius: 4px; font-family: monospace; border: 1px solid #2a2a2a; }
    .price-cell { color: #fff; font-weight: 600; font-size: 1rem; }
    .stock-pill { display: inline-block; padding: .2rem .7rem; border-radius: 99px; font-size: .75rem; font-weight: 600; }
    .stock-ok  { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
    .stock-low { background: rgba(248, 113, 113, 0.15); color: #f87171; }

    .product-img { width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid #222; }
    .img-placeholder { width: 50px; height: 50px; background: #161616; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #555; font-size: .7rem; font-weight: bold; }

    /* BOTONES */
    .btn { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; border: none; padding: .65rem 1.5rem; border-radius: 6px; cursor: pointer; transition: all .15s ease; font-size: .85rem; letter-spacing: 0.5px; }
    .btn-primary { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; transform: translateY(-1px); }
    .btn-edit { background: transparent; color: #FACC15; border: 1px solid #332800; padding: .4rem 1rem; }
    .btn-edit:hover { background: rgba(250,204,21,0.08); }
    .btn-ghost { background: #1a1a1a; color: #ccc; border: 1px solid #2a2a2a; }

    /* CONTENEDOR ARCHIVO */
    .file-input-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #141414;
      border: 1px dashed #444;
      border-radius: 6px;
      padding: .5rem;
    }
    .file-input-container:hover { border-color: #FACC15; }
    .file-input-container input[type="file"] { color: #aaa; font-size: .85rem; cursor: pointer; width: 100%; }

    /* MODALES */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-card { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; width: 100%; max-width: 680px; overflow: hidden; }

    .modal-header { background: #020202; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1f1f1f; }
    .modal-header h3 { font-family: 'Oswald', sans-serif; font-size: 1.4rem; font-weight: 700; color: white; margin: 0; text-transform: uppercase; }
    .modal-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #555; }

    .modal-body { padding: 1.5rem; display: grid; grid-template-columns: 1fr; gap: 1.25rem; max-height: 70vh; overflow-y: auto; }
    @media (min-width: 576px) { .modal-body { grid-template-columns: 1fr 1fr; } }

    .modal-field { display: flex; flex-direction: column; gap: .4rem; }
    .modal-field.span-full { grid-column: 1 / -1; }
    .modal-label { font-size: .75rem; font-weight: 600; color: #FACC15; letter-spacing: 1px; text-transform: uppercase; }

    .modal-body input, .modal-body select { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; font-size: .9rem; padding: .7rem .9rem; width: 100%; }

    .error-alert { grid-column: 1 / -1; padding: .75rem; border-radius: 6px; font-size: 0.85rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #fc8181; }
    .alert-success { padding: 1rem 1.5rem; border-radius: 8px; font-size: .9rem; background: rgba(74, 222, 128, 0.08); border: 1px solid #4ade80; color: #4ade80; margin-bottom: 1.5rem; }

    .modal-footer { padding: 1.25rem 1.5rem; border-top: 1px solid #1f1f1f; display: flex; justify-content: flex-end; gap: 0.75rem; background: #020202; }

    /* CATEGORÍAS */
    .category-search-wrapper { position: relative; grid-column: 1 / -1; }
    .category-search { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; padding: .7rem .9rem; font-size: .9rem; width: 100%; cursor: pointer; }
    .category-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #141414; border: 1px solid #FACC15; border-top: none; border-radius: 0 0 6px 6px; max-height: 180px; overflow-y: auto; z-index: 10; }
    .category-option { padding: .7rem .9rem; cursor: pointer; color: #ccc; border-bottom: 1px solid #222; }
    .category-option:hover { background: #1f1f1f; color: #FACC15; }
    .category-option.active { background: #FACC15; color: #000; font-weight: 600; }

    .empty-state { text-align: center; padding: 4rem 1rem; color: #666; font-size: 1rem; }
  `],

  template: `
<div class="modal-overlay" *ngIf="modalAbierto()" (click)="cerrarModal($event)">
  <div class="modal-card">
    <div class="modal-header">
      <h3>{{ modoEdit ? 'Editar producto ✏️' : 'Nuevo producto 📦' }}</h3>
      <button class="modal-close" (click)="modalAbierto.set(false)">✕</button>
    </div>

    <div class="modal-body">
      <div class="error-alert" *ngIf="errorMensaje">⚠️ {{ errorMensaje }}</div>

      <div class="modal-field">
        <label class="modal-label">Código SKU *</label>
        <input placeholder="Ej: MOT-001" [(ngModel)]="nuevoProducto.codigoSku">
      </div>

      <div class="modal-field">
        <label class="modal-label">Nombre *</label>
        <input placeholder="Ej: Casco Integral X" [(ngModel)]="nuevoProducto.nombre">
      </div>

      <div class="modal-field span-full">
        <label class="modal-label">Descripción *</label>
        <input placeholder="Ej: Casco con ventilación doble y visera UV" [(ngModel)]="nuevoProducto.descripcion">
      </div>

      <div class="modal-field">
        <label class="modal-label">Precio *</label>
        <input type="number" placeholder="Ej: 15000" [(ngModel)]="nuevoProducto.precio">
      </div>

      <div class="modal-field">
        <label class="modal-label">Stock *</label>
        <input type="number" step="1" placeholder="Ej: 25" [(ngModel)]="nuevoProducto.stock">
      </div>

      <div class="modal-field" [class.span-full]="!modoEdit">
        <label class="modal-label">Imagen del Producto *</label>
        <div class="file-input-container">
          <input type="file" accept="image/*" (change)="alSeleccionarImagen($event)">

          <img *ngIf="nuevoProducto.imagenUrl"
               [src]="nuevoProducto.imagenUrl"
               class="product-img"
               alt="Vista previa">
        </div>
      </div>

      <div class="modal-field" *ngIf="modoEdit">
        <label class="modal-label">Estado del Producto</label>
        <select [(ngModel)]="nuevoProducto.activo">
          <option [ngValue]="true">Activo / Disponible</option>
          <option [ngValue]="false">Inactivo / Oculto</option>
        </select>
      </div>

      <div class="category-search-wrapper span-full">
        <label class="modal-label">Categoría *</label>
        <input
          class="category-search"
          type="text"
          readonly
          placeholder="Haga clic para seleccionar..."
          [(ngModel)]="categoriaBuscada"
          (click)="mostrarDropdownCategorias = !mostrarDropdownCategorias"
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
      <button class="btn btn-ghost" (click)="modalAbierto.set(false)" [disabled]="cargando()">Cancelar</button>
      <button class="btn btn-primary" (click)="guardarProducto()" [disabled]="cargando()">
        {{cargando() ? 'Cargando...' : 'Guardar cambios'}}
      </button>
    </div>
  </div>
</div>

<div class="admin-container">
  <div class="header-container">
    <div class="top-row">
      <div class="title-section">
        <h2>Gestión de <span>Productos</span></h2>
      </div>
      <button class="btn btn-primary" (click)="abrirModalNuevoProducto()">+ Nuevo producto</button>
    </div>

    <div class="bottom-row">
      <div class="search-wrapper">
        <input
          type="text"
          class="search-input"
          placeholder="Buscar por código SKU..."
          [ngModel]="filtroSku()"
          (ngModelChange)="filtroSku.set($event)">
      </div>
      <p class="table-count">Total: <strong>{{ productosFiltrados().length }}</strong> productos encontrados</p>
    </div>
  </div>

  <div class="alert-success" *ngIf="mensajeExito">✅ {{ mensajeExito }}</div>

  <div *ngIf="productosFiltrados().length > 0; else noProducts" class="table-wrapper">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Código</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of productosFiltrados()">
          <td data-label="Imagen">
            <img *ngIf="p.imagenUrl; else noImg" [src]="p.imagenUrl" class="product-img" [alt]="p.nombre">
            <ng-template #noImg><div class="img-placeholder">S/I</div></ng-template>
          </td>
          <td data-label="Código"><span class="sku-badge">{{p.codigoSku}}</span></td>
          <td data-label="Nombre" style="color: #fff; font-weight: 600;">{{p.nombre}}</td>
          <td data-label="Descripción">{{p.descripcion}}</td>
          <td data-label="Precio" class="price-cell">$ {{p.precio}}</td>
          <td data-label="Stock">
            <span class="stock-pill" [class.stock-ok]="p.stock > 5" [class.stock-low]="p.stock <= 5">
              {{p.stock}}
            </span>
          </td>
          <td data-label="Categoría">{{p.categoria?.nombre || '—'}}</td>
          <td data-label="Estado">
            <span class="status-badge" [ngClass]="p.activo ? 'status-active' : 'status-inactive'">
              {{ p.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
          <td data-label="Acciones">
            <button class="btn btn-edit" (click)="abrirModalEditar(p)">Editar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ng-template #noProducts>
    <div class="empty-state">
      <p>{{ filtroSku() ? 'No se encontraron productos con ese código SKU.' : 'Todavía no hay productos registrados.' }}</p>
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

  filtroSku = signal<string>('');
  imagenSeleccionada: File | null = null;

  productosFiltrados = computed(() => {
    const texto = this.filtroSku().trim().toLowerCase();
    if (!texto) return this.products();
    return this.products().filter(p => p.codigoSku?.toLowerCase().includes(texto));
  });

  errorMensaje = '';
  modoEdit = false;
  mensajeExito = '';

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

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categorias.set(data);
        this.categoriasFiltradas.set(data);
      },
      error: (err: any) => console.error('Error cargando categorías:', err)
    });
  }

  cargarProductos(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => this.products.set(data),
      error: (err: any) => console.error('Error cargando productos:', err)
    });
  }

  alSeleccionarImagen(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.imagenSeleccionada = files[0];

      // Aseguramos a TS que no es nulo y creamos la vista previa local efímera
      if (this.imagenSeleccionada) {
        this.nuevoProducto.imagenUrl = URL.createObjectURL(this.imagenSeleccionada);
      }
    }
  }

  cerrarModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.modalAbierto.set(false);
    }
  }

  abrirModalNuevoProducto(): void {
    this.modoEdit = false;
    this.resetearFormulario();
    this.modalAbierto.set(true);
    this.categoriasFiltradas.set(this.categorias());
  }

  abrirModalEditar(producto: Product): void {
    this.modoEdit = true;
    this.errorMensaje = '';

    this.nuevoProducto = {
      id: producto.id,
      codigoSku: producto.codigoSku,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      imagenUrl: producto.imagenUrl,
      categoria: { ...producto.categoria },
      activo: producto.activo ?? true
    };
    this.categoriaBuscada = producto.categoria?.nombre || '';
    this.imagenSeleccionada = null;
    this.modalAbierto.set(true);
  }

  seleccionarCategoria(categoria: Category): void {
    this.nuevoProducto.categoria = categoria;
    this.categoriaBuscada = categoria.nombre;
    this.mostrarDropdownCategorias = false;
  }

  ocultarDropdown(): void {
    setTimeout(() => { this.mostrarDropdownCategorias = false; }, 150);
  }

  validarFormulario(): boolean {
    const { codigoSku, nombre, descripcion, precio, stock, categoria } = this.nuevoProducto;

    if (!codigoSku.trim() || !nombre.trim() || !descripcion.trim()) {
      this.errorMensaje = 'Por favor completa los campos de texto requeridos.';
      return false;
    }
    if (precio <= 0) {
      this.errorMensaje = 'El precio debe ser mayor a 0.';
      return false;
    }
    if (stock < 0 || !Number.isInteger(stock)) {
      this.errorMensaje = 'El stock debe ser un número entero no negativo.';
      return false;
    }
    if (!categoria || !categoria.id) {
      this.errorMensaje = 'Por favor selecciona una categoría.';
      return false;
    }
    if (!this.modoEdit && !this.imagenSeleccionada) {
      this.errorMensaje = 'Por favor selecciona un archivo de imagen.';
      return false;
    }

    this.errorMensaje = '';
    return true;
  }

 guardarProducto(): void {
    if (!this.validarFormulario()) { return; }

    this.cargando.set(true);

    // 🌟 FLUJO INTELIGENTE: ¿El usuario seleccionó una imagen local nueva?
    if (this.imagenSeleccionada) {
      // Pasamos 'this.imagenSeleccionada' que es el archivo binario real
      this.productService.uploadImage(this.imagenSeleccionada).subscribe({
        next: (res: { url: string }) => {
          // Guardamos la URL devuelta por Cloudinary en el modelo del producto
          this.nuevoProducto.imagenUrl = res.url;

          // Enviamos el objeto de texto JSON al backend de productos
          this.enviarDatosProducto();
        },
        error: (err) => {
          this.cargando.set(false);
          this.errorMensaje = 'Error al subir la imagen a Cloudinary (Verificá tokens o formato).';
          console.error('Detalle del error en subida:', err);
        }
      });
    } else {
      // Si estamos editando y no se modificó la foto, guardamos el JSON directo
      this.enviarDatosProducto();
    }
  }

  private enviarDatosProducto(): void {
    if (this.modoEdit && this.nuevoProducto.id) {
      this.productService.updateProduct(this.nuevoProducto.id, this.nuevoProducto).subscribe({
        next: () => {
          this.finalizarGuardado('Producto actualizado correctamente.');
        },
        error: () => {
          this.cargando.set(false);
          this.errorMensaje = 'Error al actualizar el producto en el servidor.';
        }
      });
    } else {
      this.productService.createProduct(this.nuevoProducto).subscribe({
        next: (producto: Product) => {
          this.products.update(p => [...p, producto]);
          this.finalizarGuardado('¡Nuevo producto registrado con éxito!');
        },
        error: () => {
          this.cargando.set(false);
          this.errorMensaje = 'Error al guardar el producto en el servidor.';
        }
      });
    }
  }

  // 🧼 Limpia los estados del modal y carga la grilla
  private finalizarGuardado(mensaje: string): void {
    this.cargarProductos();
    this.modalAbierto.set(false);
    this.cargando.set(false);
    this.resetearFormulario();
    this.mostrarMensajeExito(mensaje);
  }

  private mostrarMensajeExito(msg: string): void {
    this.mensajeExito = msg;
    setTimeout(() => { this.mensajeExito = ''; }, 3000);
  }

  resetearFormulario(): void {
    this.nuevoProducto = {
      codigoSku: '', nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '',
      categoria: { id: 0, nombre: '' }, activo: true
    };
    this.categoriaBuscada = '';
    this.errorMensaje = '';
    this.imagenSeleccionada = null;
    this.mostrarDropdownCategorias = false;
  }
}
