import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

interface CartItem {
  producto: any;
  cantidad: number;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght=300;400;500;600;700&family=Inter:wght=400;500;600&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── SHELL ─────────────────────────────────── */
    .shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #0d0d0d;
      font-family: 'Oswald', system-ui, sans-serif;
    }

    /* ── HEADER ─────────────────────────────────── */
    .hdr {
      height: 52px;
      background: #111;
      border-bottom: 1px solid #222;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .hdr-brand { display: flex; align-items: center; gap: 10px; }
    .hdr-mark { width: 28px; height: 28px; background: #FACC15; display: flex; align-items: center; justify-content: center; }
    .hdr-mark span { color: #0d0d0d; font-weight: 700; font-size: 13px; letter-spacing: -0.5px; }
    .hdr-title { font-size: 17px; font-weight: 600; letter-spacing: 2px; color: #fff; text-transform: uppercase; }
    .hdr-title em { color: #FACC15; font-style: normal; }
    .hdr-right { display: flex; align-items: center; gap: 16px; }
    .hdr-role { font-size: 11px; letter-spacing: 2px; color: #555; text-transform: uppercase; font-weight: 500; }
    
    .hdr-avatar {
      width: 32px;
      height: 32px;
      border: 1.5px solid #FACC15;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #FACC15;
      letter-spacing: 1px;
      border-radius: 50%;
      overflow: hidden;
      background: #111;
    }
    .hdr-avatar img { width: 100%; height: 100%; object-fit: cover; }

    /* ── LAYOUT ─────────────────────────────────── */
    .layout { display: flex; flex: 1; }

    /* ── SIDEBAR ─────────────────────────────────── */
    .sidebar {
      width: 210px;
      background: #111;
      border-right: 1px solid #1e1e1e;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 52px;
      height: calc(100vh - 52px);
      overflow-y: auto;
    }
    .sidebar::-webkit-scrollbar { width: 3px; }
    .sidebar::-webkit-scrollbar-thumb { background: #2a2a2a; }
    .sb-top { flex: 1; }
    .sb-section { padding: 20px 0 8px; }
    .sb-label { font-size: 9px; letter-spacing: 3px; color: #444; text-transform: uppercase; font-weight: 600; padding: 0 18px 8px; }
    
    .sb-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 18px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      border-left: 2.5px solid transparent;
      color: #666;
      font-size: 13px;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      font-weight: 500;
    }
    .sb-item:hover { background: #181818; color: #aaa; }
    .sb-item.active { border-left-color: #FACC15; background: #161610; color: #FACC15; }
    .sb-item i { font-size: 16px; flex-shrink: 0; }
    .sb-divider { height: 1px; background: #1a1a1a; margin: 6px 18px; }
    .sb-badge { margin-left: auto; background: #FACC15; color: #0d0d0d; font-size: 9px; font-weight: 700; padding: 2px 6px; min-width: 18px; text-align: center; }

    .sb-footer { padding: 14px 18px; border-top: 1px solid #1a1a1a; flex-shrink: 0; display: flex; flex-direction: column; gap: 2px; }
    .sb-footer-item { display: flex; align-items: center; gap: 10px; padding: 9px 0; cursor: pointer; color: #555; font-size: 13px; letter-spacing: 1.2px; text-transform: uppercase; font-weight: 500; transition: color 0.15s; background: none; border: none; width: 100%; font-family: 'Oswald', sans-serif; }
    .sb-footer-item:hover { color: #aaa; }
    .sb-footer-item i { font-size: 16px; flex-shrink: 0; }
    .sb-footer-item.logout:hover { color: #e55; }

    /* ── CONTENIDO ───────────────────────────────── */
    .main { flex: 1; background: #0d0d0d; overflow-y: auto; padding: 28px; }
    .main-eyebrow { font-size: 10px; letter-spacing: 3px; color: #444; text-transform: uppercase; font-weight: 500; margin-bottom: 6px; }
    .main-title { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; padding-bottom: 14px; border-bottom: 1px solid #1a1a1a; }
    .main-title span { color: #FACC15; }

    /* ── GRID COMUNES ──────────────────────────── */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }

    .card { background: #141414; border: 1px solid #1e1e1e; display: flex; flex-direction: column; transition: border-color 0.15s, transform 0.15s; }
    .card:hover { border-color: #2a2a2a; transform: translateY(-2px); }
    .card-img { width: 100%; height: 150px; object-fit: cover; display: block; background: #1a1a1a; }
    .card-body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .card-name { font-size: 14px; font-weight: 600; color: #e5e5e5; letter-spacing: 0.3px; }
    .card-sku { font-size: 10px; color: #444; letter-spacing: 1.5px; text-transform: uppercase; }
    .card-price { font-size: 20px; font-weight: 700; color: #FACC15; margin-top: 8px; }
    .card-footer { padding: 10px 16px; border-top: 1px solid #1a1a1a; }

    /* 🌟 TARJETAS TOTALMENTE CUADRADAS PARA LAS COMPRAS */
    .factura-card {
      background: #141414;
      border: 1px solid #1e1e1e;
      border-radius: 0px; 
      aspect-ratio: 1 / 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
    }
    .factura-card:hover { border-color: #FACC15; }
    .factura-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .factura-card-num { font-size: 22px; font-weight: 700; color: #FACC15; }
    .factura-card-date { font-family: 'Inter', sans-serif; font-size: 12px; color: #555; margin-top: 4px; }
    .factura-card-totalbox { border-top: 1px dashed #222; padding-top: 14px; }
    .factura-card-label { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 1px; }
    .factura-card-monto { font-size: 24px; font-weight: 700; color: #fff; }

    /* ── BOTONES ────────────────────────────────── */
    .btn { display: block; width: 100%; font-family: 'Oswald', system-ui, sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; border: none; padding: 8px 14px; cursor: pointer; transition: background 0.15s, transform 0.1s; }
    .btn:active:not(:disabled) { transform: scale(0.97); }
    .btn-yellow { background: #FACC15; color: #0d0d0d; }
    .btn-yellow:hover:not(:disabled) { background: #EAB308; }
    .btn-yellow:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; }
    .btn-ghost-red { background: transparent; color: #f87171; border: 1px solid #3a1f1f; font-family: 'Oswald', system-ui, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 5px 10px; cursor: pointer; }
    .btn-ghost-red:hover { background: rgba(248,113,113,0.08); border-color: #f87171; }
    .btn-danger { background: transparent; color: #ef4444; border: 1px solid #3a1f1f; margin-top: 24px; font-family: 'Oswald', system-ui, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 8px 14px; cursor: pointer; width: 100%; }
    .btn-danger:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

    /* ── TABLA CARRITO ──────────────────────────── */
    .table-wrap { background: #141414; border: 1px solid #1e1e1e; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    thead tr { background: #111; border-bottom: 1px solid #FACC15; }
    thead th { color: #FACC15; font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 12px 18px; text-align: left; }
    tbody tr { border-bottom: 1px solid #1a1a1a; transition: background 0.1s; }
    tbody tr:hover { background: #161616; }
    tbody td { color: #bbb; padding: 12px 18px; vertical-align: middle; }
    .td-name { color: #e5e5e5; font-weight: 500; }
    .td-price { color: #777; }
    .td-subtotal { color: #FACC15; font-weight: 600; }

    /* ── BADGES ─────────────────────────────────── */
    .badge { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 3px 8px; border: 1px solid; }
    .badge-green { background: #0f1a0f; color: #4ade80; border-color: rgba(74,222,128,0.3); }
    .badge-yellow { background: #1e1a00; color: #FACC15; border-color: rgba(250,204,21,0.3); }

    .summary-box { background: #141414; border: 1px solid #1e1e1e; padding: 20px; max-width: 400px; margin-left: auto; }
    .summary-label { font-size: 10px; letter-spacing: 3px; color: #444; text-transform: uppercase; margin-bottom: 14px; }
    .summary-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 18px; }
    .summary-total-label { font-size: 12px; color: #555; letter-spacing: 1px; text-transform: uppercase; }
    .summary-total-val { font-size: 26px; font-weight: 700; color: #FACC15; }

    /* ── PROFILE & FORM ─────────────────────────── */
    .profile-card { background: #141414; border: 1px solid #1e1e1e; padding: 24px; max-width: 440px; }
    .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-size: 9px; font-weight: 600; color: #FACC15; letter-spacing: 2.5px; text-transform: uppercase; }
    .form-control { background: #1a1a1a; border: 1px solid #2a2a2a; color: #e5e5e5; font-family: 'Oswald', sans-serif; font-size: 14px; padding: 9px 12px; width: 100%; outline: none; transition: border-color 0.15s; }
    .form-control:focus { border-color: #FACC15; }
    .form-divider { height: 1px; background: #1e1e1e; margin: 20px 0; }
    .info-static { background: #111; padding: 9px 12px; color: #555; font-size: 14px; border: 1px solid #1e1e1e; font-family: system-ui, sans-serif; }

    /* Avatar e integración de Mis Documentos */
    .avatar-preview-wrapper { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
    .avatar-big { width: 64px; height: 64px; border: 2px solid #FACC15; border-radius: 50%; overflow: hidden; background: #111; display: flex; align-items: center; justify-content: center; color: #FACC15; font-weight: bold; }
    .avatar-big img { width: 100%; height: 100%; object-fit: cover; }

    .alert { padding: 10px 14px; font-size: 13px; margin-bottom: 16px; font-family: system-ui, sans-serif; }
    .alert-error { background: rgba(239,68,68,0.1); border: 1px solid #3a1515; color: #fc8181; }
    .alert-success { background: rgba(74,222,128,0.1); border: 1px solid #0f2a1a; color: #a7f3d0; }
    .empty-state { text-align: center; padding: 48px 16px; border: 1px dashed #1e1e1e; }
    .empty-state p { color: #444; font-size: 13px; }
    .empty-hint { color: #FACC15; font-size: 11px; margin-top: 8px; letter-spacing: 2px; text-transform: uppercase; }

    /* Toasts */
    .toast-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: #111; border-left: 3px solid #FACC15; border-top: 1px solid #222; padding: 14px 18px; min-width: 260px; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-family: system-ui, sans-serif; animation: slideIn 0.2s ease-out forwards; }
    .toast.success { border-left-color: #4ade80; }
    .toast-body { display: flex; flex-direction: column; gap: 2px; }
    .toast-title { font-family: 'Oswald', sans-serif; text-transform: uppercase; font-weight: 700; font-size: 12px; color: #FACC15; }
    .toast.success .toast-title { color: #4ade80; }
    .toast-msg { color: #aaa; font-size: 12px; }
    .toast-close { cursor: pointer; color: #444; font-size: 12px; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of activeToasts" class="toast" [class.success]="t.tipo === 'success'">
        <div class="toast-body">
          <div class="toast-title">{{ t.titulo }}</div>
          <div class="toast-msg">{{ t.mensaje }}</div>
        </div>
        <span class="toast-close" (click)="removerToast(t)">✕</span>
      </div>
    </div>

    <div class="shell">
      <div class="hdr">
        <div class="hdr-brand">
          <div class="hdr-mark"><span>MX</span></div>
          <div class="hdr-title">Moto<em>X</em> Store</div>
        </div>
        <div class="hdr-right">
          <div class="hdr-role">{{ usuarioLogueado?.nombre || 'Cliente' }}</div>
          
          <div class="hdr-avatar">
            <img *ngIf="usuarioLogueado?.imagenUrl" [src]="usuarioLogueado.imagenUrl" alt="Avatar">
            <span *ngIf="!usuarioLogueado?.imagenUrl">{{ iniciales }}</span>
          </div>
        </div>
      </div>

      <div class="layout">
        <div class="sidebar">
          <div class="sb-top">
            <div class="sb-section">
              <div class="sb-label">Tienda</div>
              <div class="sb-item" [class.active]="vistaSubActual === 'catalogo'" (click)="vistaSubActual = 'catalogo'">
                <i class="ti ti-package" aria-hidden="true"></i> Catalogo
              </div>
              <div class="sb-item" [class.active]="vistaSubActual === 'carrito'" (click)="vistaSubActual = 'carrito'">
                <i class="ti ti-shopping-cart" aria-hidden="true"></i> Carrito
                <span class="sb-badge" *ngIf="totalItemsEnCarrito > 0">{{ totalItemsEnCarrito }}</span>
              </div>
            </div>
            <div class="sb-divider"></div>
            <div class="sb-section">
              <div class="sb-label">Historial</div>
              <div class="sb-item" [class.active]="vistaSubActual === 'compras'" (click)="abrirMisCompras()">
                <i class="ti ti-receipt" aria-hidden="true"></i> Mis compras
              </div>
            </div>
          </div>
          <div class="sb-footer">
            <button class="sb-footer-item" [class.active]="vistaSubActual === 'perfil'" (click)="abrirPerfil()">
              <i class="ti ti-user-circle" aria-hidden="true"></i> Mi perfil
            </button>
            <button class="sb-footer-item logout" (click)="logout()">
              <i class="ti ti-logout" aria-hidden="true"></i> Cerrar sesion
            </button>
          </div>
        </div>

        <main class="main">

          <div *ngIf="vistaSubActual === 'catalogo'">
            <div class="main-eyebrow">Tienda</div>
            <div class="main-title">Repuestos <span>Disponibles</span></div>
            <div class="grid">
              <div class="card" *ngFor="let prod of productos">
                <img class="card-img" [src]="prod.imagenUrl || 'https://via.placeholder.com/300x150/141414/FACC15?text=MX'" alt="Imagen">
                <div class="card-body">
                  <div class="card-name">{{ prod.nombre }}</div>
                  <div class="card-sku">SKU: {{ prod.codigoSku }}</div>
                  <div class="card-price">\${{ prod.precio }}</div>
                </div>
                <div class="card-footer">
                  <button class="btn btn-yellow" (click)="agregarAlCarrito(prod)" [disabled]="prod.stock <= 0">
                    {{ prod.stock > 0 ? '+ Agregar al carrito' : 'Sin stock' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="vistaSubActual === 'carrito'">
            <div class="main-eyebrow">Compra</div>
            <div class="main-title">Tu <span>Carrito</span></div>
            <div *ngIf="carrito.length === 0" class="empty-state">
              <p>El carrito esta vacio.</p>
              <p class="empty-hint">Agrega productos desde el catalogo</p>
            </div>
            <div *ngIf="carrito.length > 0">
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of carrito">
                      <td class="td-name">{{ item.producto.nombre }}</td>
                      <td class="td-price">\${{ item.producto.precio }}</td>
                      <td>{{ item.cantidad }}</td>
                      <td class="td-subtotal">\${{ item.producto.precio * item.cantidad }}</td>
                      <td><button class="btn-ghost-red" (click)="eliminarDelCarrito(item)">Quitar</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="summary-box">
                <div class="summary-label">Resumen de compra</div>
                <div class="summary-total-row">
                  <span class="summary-total-label">Total</span>
                  <span class="summary-total-val">\${{ calcularTotalCarrito() }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">Metodo de pago</label>
                  <select class="form-control" [(ngModel)]="metodoPagoSeleccionado">
                    <option *ngFor="let mp of metodosPago" [ngValue]="mp">{{ mp.nombre || 'ID: ' + mp.id }}</option>
                  </select>
                </div>
                <button class="btn btn-yellow" (click)="procesarCompra()" [disabled]="!metodoPagoSeleccionado">Confirmar compra</button>
              </div>
            </div>
          </div>

          <div *ngIf="vistaSubActual === 'compras'">
            <div class="main-eyebrow">Historial</div>
            <div class="main-title">Mis <span>Compras</span></div>

            <div class="form-group" style="max-width: 260px; margin-bottom: 24px;">
              <label class="form-label">Buscar por Nro. Factura</label>
              <input type="text" class="form-control" [(ngModel)]="filtroFactura" placeholder="Ej: 3">
            </div>

            <div *ngIf="getFacturasFiltradas().length === 0" class="empty-state"><p>No se encontraron comprobantes.</p></div>

            <div class="grid" *ngIf="getFacturasFiltradas().length > 0">
              <div class="factura-card" *ngFor="let fact of getFacturasFiltradas()">
                <div class="factura-card-header">
                  <div>
                    <div class="factura-card-num">#00{{ fact.id }}</div>
                    <div class="factura-card-date">{{ fact.fecha | date:'dd/MM/yyyy HH:mm' }}</div>
                  </div>
                  <span class="badge" [ngClass]="fact.estado === 'PAGADA' ? 'badge-green' : 'badge-yellow'">{{ fact.estado }}</span>
                </div>
                <div class="factura-card-totalbox">
                  <div class="factura-card-label">Total Abonado</div>
                  <div class="factura-card-monto">\${{ fact.total }}</div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="vistaSubActual === 'perfil'">
            <div class="main-eyebrow">Cuenta</div>
            <div class="main-title">Mi <span>Perfil</span></div>

            <div class="profile-card">
              <div class="alert alert-error" *ngIf="errorPerfil">{{ errorPerfil }}</div>
              <div class="alert alert-success" *ngIf="successPerfil">{{ successPerfil }}</div>

              <form (ngSubmit)="guardarPerfil()">
                <div class="avatar-preview-wrapper">
                  <div class="avatar-big">
                    <img *ngIf="perfilForm.imagenUrl" [src]="perfilForm.imagenUrl" alt="Preview">
                    <span *ngIf="!perfilForm.imagenUrl">{{ iniciales }}</span>
                  </div>
                  <div>
                    <label class="form-label" style="margin-bottom: 0.5rem; display: block;">Foto de Perfil</label>
                    <input type="file" id="fileAvatar" accept="image/*" style="display: none;" (change)="onFileSelected($event)">
                    <button type="button" class="btn btn-yellow" style="padding: 6px 12px; width: auto;" onclick="document.getElementById('fileAvatar').click()">
                      <i class="ti ti-upload" style="font-size:14px; margin-right:4px;"></i> Seleccionar de mis documentos
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Correo electronico</label>
                  <div class="info-static">{{ perfilForm.email }}</div>
                </div>
                <div class="form-group">
                  <label class="form-label">Nombre completo</label>
                  <input type="text" class="form-control" [(ngModel)]="perfilForm.nombre" name="nombrePerfil">
                </div>
                
                <div class="form-group">
                  <label class="form-label">Dirección de Entrega / Envío</label>
                  <input type="text" class="form-control" [(ngModel)]="perfilForm.direccion" name="direccionPerfil" placeholder="Ej: Av. Kirchner 1540, Formosa">
                </div>

                <div class="form-divider"></div>
                <div class="form-group">
                  <label class="form-label">Contrasenia actual</label>
                  <input type="password" class="form-control" [(ngModel)]="perfilForm.contraseniaActual" name="actualPass" placeholder="••••••">
                </div>
                <div class="form-group">
                  <label class="form-label">Nueva contrasenia (minimo 6 caracteres)</label>
                  <input type="password" class="form-control" [(ngModel)]="perfilForm.nuevaContrasenia" name="nuevaPass" placeholder="••••••">
                </div>

                <button type="submit" class="btn btn-yellow">Actualizar datos</button>
              </form>

              <button class="btn-danger" (click)="eliminarMiCuenta()">Eliminar cuenta permanentemente</button>
            </div>
          </div>

        </main>
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  vistaSubActual = 'catalogo';
  productos: any[] = [];
  metodosPago: any[] = [];
  carrito: CartItem[] = [];
  misFacturas: any[] = [];
  filtroFactura: string = ''; 

  metodoPagoSeleccionado: any = null;
  usuarioLogueado: any = null;
  errorPerfil = '';
  successPerfil = '';
  
  // Estructura 1:1 con PerfilActualizarDTO.java
  perfilForm = { 
    nombre: '', 
    email: '', 
    contraseniaActual: '', 
    nuevaContrasenia: '',
    imagenUrl: '',
    direccion: ''
  };
  activeToasts: Array<{ titulo: string; mensaje: string; tipo: string }> = [];

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      this.usuarioLogueado = JSON.parse(sesion);
      const carritoGuardado = localStorage.getItem(`carrito_${this.usuarioLogueado?.id}`);
      if (carritoGuardado) this.carrito = JSON.parse(carritoGuardado);
    }
    this.cargarDatos();
    if (this.usuarioLogueado?.rol === 'ADMIN') {
      this.abrirPerfil();
    } else {
      this.cdr.detectChanges();
    }
  }

  get iniciales(): string {
    const nombre: string = this.usuarioLogueado?.nombre || this.usuarioLogueado?.email || 'MX';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2 && partes[0][0] && partes[1][0]) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }

  cargarDatos() {
    this.customerService.getProductosActivos().subscribe(res => {
      this.productos = res;
      this.cdr.detectChanges();
    });
    this.customerService.getMetodosPago().subscribe(res => {
      this.metodosPago = res;
      if (res.length > 0) this.metodoPagoSeleccionado = res[0];
      this.cdr.detectChanges();
    });
  }

  get totalItemsEnCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  sincronizarCarritoStorage() {
    if (this.usuarioLogueado) {
      localStorage.setItem(`carrito_${this.usuarioLogueado.id}`, JSON.stringify(this.carrito));
    }
  }

  lanzarNotificacion(titulo: string, mensaje: string, tipo: string = 'info') {
    const t = { titulo, mensaje, tipo };
    this.activeToasts.push(t);
    this.cdr.detectChanges();
    setTimeout(() => this.removerToast(t), 3000);
  }

  removerToast(toast: any) {
    this.activeToasts = this.activeToasts.filter(t => t !== toast);
    this.cdr.detectChanges();
  }

  // Lógica del explorador de archivos locales nativos
  onFileSelected(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    if (archivo.size > 2 * 1024 * 1024) {
      this.lanzarNotificacion('Archivo muy grande', 'Elegí una foto de menos de 2MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.perfilForm.imagenUrl = reader.result as string; // Convierte a String Base64 para Java
      this.cdr.detectChanges();
      this.lanzarNotificacion('Foto cargada', 'Previsualización exitosa de mis documentos.', 'success');
    };
    reader.readAsDataURL(archivo);
  }

  getFacturasFiltradas(): any[] {
    if (!this.filtroFactura || !this.filtroFactura.trim()) return this.misFacturas;
    return this.misFacturas.filter(f => String(f.id).includes(this.filtroFactura.trim()));
  }

  abrirMisCompras() {
    this.vistaSubActual = 'compras';
    this.filtroFactura = '';
    let headers = new HttpHeaders();
    if (this.usuarioLogueado?.token) {
      headers = headers.set('Authorization', `Bearer ${this.usuarioLogueado.token}`);
    }
    this.http.get<any[]>('http://localhost:8080/api/facturas/mis-facturas', { headers, withCredentials: true }).subscribe({
      next: res => { this.misFacturas = res; this.cdr.detectChanges(); },
      error: () => this.lanzarNotificacion('Error', 'No se pudieron recuperar las compras.', 'error')
    });
  }

  abrirPerfil() {
    this.vistaSubActual = 'perfil';
    this.errorPerfil = '';
    this.successPerfil = '';
    if (this.usuarioLogueado) {
      this.perfilForm.nombre = this.usuarioLogueado.nombre || '';
      this.perfilForm.email = this.usuarioLogueado.email || '';
      this.perfilForm.imagenUrl = this.usuarioLogueado.imagenUrl || '';
      this.perfilForm.direccion = this.usuarioLogueado.direccion || '';
      this.perfilForm.contraseniaActual = '';
      this.perfilForm.nuevaContrasenia = '';
    }
    this.cdr.detectChanges();
  }

  guardarPerfil() {
    this.errorPerfil = '';
    this.successPerfil = '';
    if (!this.perfilForm.nombre?.trim()) {
      this.errorPerfil = 'El nombre completo es obligatorio.';
      this.cdr.detectChanges();
      return;
    }
    
    const datosPayload = {
      nombre: this.perfilForm.nombre.trim(),
      contraseniaActual: this.perfilForm.contraseniaActual || null,
      nuevaContrasenia: this.perfilForm.nuevaContrasenia || null,
      imagenUrl: this.perfilForm.imagenUrl || null,
      direccion: this.perfilForm.direccion ? this.perfilForm.direccion.trim() : null
    };

    this.userService.actualizarPerfil(datosPayload).subscribe({
      next: res => {
        this.successPerfil = '¡Perfil actualizado correctamente!';
        if (this.usuarioLogueado) {
          this.usuarioLogueado.nombre = res.nombre;
          this.usuarioLogueado.imagenUrl = res.imagenUrl;
          this.usuarioLogueado.direccion = res.direccion;
          localStorage.setItem('sesion', JSON.stringify(this.usuarioLogueado));
        }
        this.perfilForm.contraseniaActual = '';
        this.perfilForm.nuevaContrasenia = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorPerfil = 'Error al actualizar el perfil en el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  eliminarMiCuenta() {
    if (confirm('¿Estas seguro de dar de baja tu cuenta? Esta accion es permanente.')) {
      this.logout();
    }
  }

  agregarAlCarrito(producto: any) {
    const existente = this.carrito.find(item => item.producto.id === producto.id);
    if (existente) { existente.cantidad++; } else { this.carrito.push({ producto, cantidad: 1 }); }
    this.sincronizarCarritoStorage();
    this.lanzarNotificacion('Carrito actualizado', `"${producto.nombre}" agregado.`, 'info');
  }

  eliminarDelCarrito(item: CartItem) {
    this.carrito = this.carrito.filter(c => c.producto.id !== item.producto.id);
    this.sincronizarCarritoStorage();
    this.lanzarNotificacion('Carrito actualizado', 'Repuesto quitado.', 'info');
  }

  calcularTotalCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  }

  procesarCompra() {
    if (!this.carrito.length) return;
    let headers = new HttpHeaders();
    if (this.usuarioLogueado?.token) {
      headers = headers.set('Authorization', `Bearer ${this.usuarioLogueado.token}`);
    }
    const facturaDTO = {
      idUsuario: this.usuarioLogueado?.id || null,
      fecha: new Date().toISOString(),
      total: this.calcularTotalCarrito(),
      estado: 'PAGADA',
      idMetodoPago: this.metodoPagoSeleccionado.id,
      detalles: this.carrito.map(item => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
        subtotal: item.producto.precio * item.cantidad
      }))
    };
    this.http.post('http://localhost:8080/api/facturas', facturaDTO, { headers, withCredentials: true }).subscribe({
      next: () => {
        this.lanzarNotificacion('Compra exitosa', 'Tu orden fue facturada con éxito.', 'success');
        this.carrito = [];
        this.sincronizarCarritoStorage();
        this.abrirMisCompras();
      },
      error: err => {
        this.lanzarNotificacion('Error de pago', err.error?.message || 'No se pudo procesar la transaccion.', 'error');
      }
    });
  }

  logout() {
    if (this.usuarioLogueado) { localStorage.removeItem(`carrito_${this.usuarioLogueado.id}`); }
    localStorage.removeItem('sesion');
    localStorage.removeItem('perfil_nombre_editado');
    window.location.reload();
  }
}