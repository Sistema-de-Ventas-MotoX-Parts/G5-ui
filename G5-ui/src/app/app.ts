import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './core/header/header';
import { SidebarComponent } from './core/sidebar/sidebar';
import { ProductListComponent } from './components/product-list/product-list';
import { CategoryListComponent } from './components/product-list/category-list';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './core/auth/login/login';
import { RegisterComponent } from './core/auth/register/register';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { UserListComponent } from './components/product-list/user-list';
import { AdminServiciosComponent } from './components/admin-servicios/admin-servicios.component';
import { AdminFacturasComponent } from './components/admin-facturas/admin-facturas.component';
import { AdminMotocicletasComponent } from './components/admin-motocicletas/admin-motocicletas.component';
import { AdminOrdenesComponent } from './components/admin-ordenes/admin-ordenes.component';
import { MechanicDashboardComponent } from './components/mechanic-dashboard/mechanic-dashboard.component';
import { AdminMarcasComponent } from './components/admin-marcas/admin-marcas.component';
import { AdminModelosComponent } from './components/admin-modelos/admin-modelos.component';
import { MecanicoOrdenesComponent } from './components/mecanico-ordenes/mecanico-ordenes.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    ProductListComponent,
    CategoryListComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserDashboardComponent,
    UserListComponent,
    AdminServiciosComponent,
    AdminFacturasComponent,
    AdminMotocicletasComponent,
    AdminOrdenesComponent,
    MechanicDashboardComponent,
    AdminMarcasComponent,
    AdminModelosComponent,
    MecanicoOrdenesComponent,
  ],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

    :host {
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
    .hdr-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .hdr-mark {
      width: 28px;
      height: 28px;
      background: #FACC15;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hdr-mark span {
      color: #0d0d0d;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: -0.5px;
    }
    .hdr-title {
      font-size: 17px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #fff;
      text-transform: uppercase;
    }
    .hdr-title em {
      color: #FACC15;
      font-style: normal;
    }
    .hdr-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .hdr-role {
      font-size: 11px;
      letter-spacing: 2px;
      color: #555;
      text-transform: uppercase;
      font-weight: 500;
    }
    .hdr-avatar {
      width: 30px;
      height: 30px;
      border: 1.5px solid #FACC15;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #FACC15;
      letter-spacing: 1px;
    }

    /* ── LAYOUT ─────────────────────────────────── */
    .layout {
      display: flex;
      flex: 1;
    }
    main {
      flex: 1;
      background: #0d0d0d;
      overflow-y: auto;
    }

    /* ── SIDEBAR ─────────────────────────────────── */
    .sidebar {
      width: 210px;
      background: #111;
      border-right: 1px solid #1e1e1e;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      min-height: calc(100vh - 52px);
      position: sticky;
      top: 52px;
      height: calc(100vh - 52px);
      overflow-y: auto;
    }
    .sidebar::-webkit-scrollbar { width: 3px; }
    .sidebar::-webkit-scrollbar-track { background: #111; }
    .sidebar::-webkit-scrollbar-thumb { background: #2a2a2a; }

    .sb-top { flex: 1; }

    .sb-section { padding: 20px 0 8px; }

    .sb-label {
      font-size: 9px;
      letter-spacing: 3px;
      color: #444;
      text-transform: uppercase;
      font-weight: 600;
      padding: 0 18px 8px;
    }
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
    .sb-item:hover {
      background: #181818;
      color: #aaa;
    }
    .sb-item.active {
      border-left-color: #FACC15;
      background: #161600;
      color: #FACC15;
    }
    .sb-item i {
      font-size: 16px;
      flex-shrink: 0;
    }
    .sb-divider {
      height: 1px;
      background: #1a1a1a;
      margin: 6px 18px;
    }

    /* ── SIDEBAR FOOTER ─────────────────────────── */
    .sb-footer {
      padding: 14px 18px;
      border-top: 1px solid #1a1a1a;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .sb-footer-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 0;
      cursor: pointer;
      color: #555;
      font-size: 13px;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      font-weight: 500;
      transition: color 0.15s;
      background: none;
      border: none;
      width: 100%;
      font-family: 'Oswald', system-ui, sans-serif;
    }
    .sb-footer-item:hover { color: #aaa; }
    .sb-footer-item i { font-size: 16px; flex-shrink: 0; }

    .sb-footer-item.logout:hover { color: #e55; }

    /* ── INICIO BIENVENIDA ──────────────────────── */
    .inicio-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 52px);
      text-align: center;
      padding: 2rem;
    }
    .inicio-title {
      font-size: 2.75rem;
      font-weight: 700;
      color: white;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .inicio-title span { color: #FACC15; }
    .inicio-sub {
      font-size: 0.85rem;
      letter-spacing: 3px;
      color: #444;
      text-transform: uppercase;
      margin-top: 12px;
    }

    /* ── FOOTER ─────────────────────────────────── */
    footer {
      background: #000;
      padding: 0.9rem 1.75rem;
      display: flex;
      justify-content: space-between;
    }
  `],
  template: `
    <!-- HOME -->
    <div *ngIf="vistaActual === 'home'">
      <app-home (navegar)="cambiarVista($any($event))"></app-home>
    </div>

    <!-- LOGIN -->
    <div *ngIf="vistaActual === 'login'">
      <app-login
        (onLoginSuccess)="cambiarVistaDespuesLogin()"
        (irARegistro)="cambiarVista('register')">
      </app-login>
    </div>

    <!-- REGISTER -->
    <div *ngIf="vistaActual === 'register'">
      <app-register
        (onRegisterSuccess)="cambiarVista('login')"
        (irALogin)="cambiarVista('login')">
      </app-register>
    </div>

    <!-- DASHBOARD MECÁNICO -->
    <div *ngIf="vistaActual === 'dashboard-mechanic'">
      <app-mechanic-dashboard></app-mechanic-dashboard>
      <app-mecanico-ordenes></app-mecanico-ordenes>
    </div>

    <!-- DASHBOARD USUARIO -->
    <div *ngIf="vistaActual === 'dashboard-user'">
      <app-user-dashboard></app-user-dashboard>
    </div>

    <!-- LAYOUT ADMIN -->
    <ng-container *ngIf="esVistaAdmin()">

      <!-- Header -->
      <div class="hdr">
        <div class="hdr-brand">
          <div class="hdr-mark"><span>MX</span></div>
          <div class="hdr-title">Moto<em>X</em> Parts</div>
        </div>
        <div class="hdr-right">
          <div class="hdr-role">{{ rolUsuario }}</div>
          <div class="hdr-avatar">{{ inicialesUsuario }}</div>
        </div>
      </div>

      <div class="layout">

        <!-- Sidebar -->
        <div class="sidebar">
          <div class="sb-top">

            <div class="sb-section">
              <div class="sb-label">Principal</div>
              <div class="sb-item" [class.active]="vistaActual === 'inicio'" (click)="cambiarVista('inicio')">
                <i class="ti ti-layout-dashboard" aria-hidden="true"></i> Panel
              </div>
            </div>

            <div class="sb-divider"></div>

            <div class="sb-section">
              <div class="sb-label">Catalogo</div>
              <div class="sb-item" [class.active]="vistaActual === 'productos'" (click)="cambiarVista('productos')">
                <i class="ti ti-package" aria-hidden="true"></i> Productos
              </div>
              <div class="sb-item" [class.active]="vistaActual === 'categorias'" (click)="cambiarVista('categorias')">
                <i class="ti ti-tag" aria-hidden="true"></i> Categorias
              </div>
              <div class="sb-item" [class.active]="vistaActual === 'marcas'" (click)="cambiarVista('marcas')">
                <i class="ti ti-award" aria-hidden="true"></i> Marcas
              </div>
              <div class="sb-item" [class.active]="vistaActual === 'modelos'" (click)="cambiarVista('modelos')">
                <i class="ti ti-list" aria-hidden="true"></i> Modelos
              </div>
            </div>

            <div class="sb-divider"></div>

            <div class="sb-section">
              <div class="sb-label">Operaciones</div>
              <div class="sb-item" [class.active]="vistaActual === 'facturas'" (click)="cambiarVista('facturas')">
                <i class="ti ti-file-invoice" aria-hidden="true"></i> Facturas
              </div>
              <div class="sb-item" [class.active]="vistaActual === 'ordenes'" (click)="cambiarVista('ordenes')">
                <i class="ti ti-clipboard-list" aria-hidden="true"></i> Ordenes
              </div>
              <div class="sb-item" [class.active]="vistaActual === 'servicios'" (click)="cambiarVista('servicios')">
                <i class="ti ti-tool" aria-hidden="true"></i> Servicios
              </div>
            </div>

            <div class="sb-divider"></div>

            <div class="sb-section">
              <div class="sb-label">Flota</div>
              <div class="sb-item" [class.active]="vistaActual === 'motocicletas'" (click)="cambiarVista('motocicletas')">
                <i class="ti ti-motorbike" aria-hidden="true"></i> Motocicletas
              </div>
            </div>

            <div class="sb-divider"></div>

            <div class="sb-section">
              <div class="sb-label">Acceso</div>
              <div class="sb-item" [class.active]="vistaActual === 'usuarios'" (click)="cambiarVista('usuarios')">
                <i class="ti ti-users" aria-hidden="true"></i> Usuarios
              </div>
            </div>

          </div>

          <!-- Footer del sidebar: Perfil + Cerrar sesion -->
          <div class="sb-footer">
            <button class="sb-footer-item" (click)="cambiarVista('mi-perfil')">
              <i class="ti ti-user-circle" aria-hidden="true"></i> Mi perfil
            </button>
            <button class="sb-footer-item logout" (click)="cerrarSesion()">
              <i class="ti ti-logout" aria-hidden="true"></i> Cerrar sesion
            </button>
          </div>
        </div>

        <!-- Contenido principal -->
        <main>
          <div *ngIf="vistaActual === 'inicio'" class="inicio-wrapper">
            <h1 class="inicio-title">Bienvenido a <span>MotoX Parts</span></h1>
            <p class="inicio-sub">Panel de administracion</p>
          </div>

          <app-product-list        *ngIf="vistaActual === 'productos'"></app-product-list>
          <app-category-list       *ngIf="vistaActual === 'categorias'"></app-category-list>
          <app-user-list           *ngIf="vistaActual === 'usuarios'"></app-user-list>
          <app-admin-servicios     *ngIf="vistaActual === 'servicios'"></app-admin-servicios>
          <app-admin-facturas      *ngIf="vistaActual === 'facturas'"></app-admin-facturas>
          <app-admin-motocicletas  *ngIf="vistaActual === 'motocicletas'"></app-admin-motocicletas>
          <app-admin-ordenes       *ngIf="vistaActual === 'ordenes'"></app-admin-ordenes>
          <app-admin-marcas        *ngIf="vistaActual === 'marcas'"></app-admin-marcas>
          <app-admin-modelos       *ngIf="vistaActual === 'modelos'"></app-admin-modelos>
          <app-user-dashboard      *ngIf="vistaActual === 'mi-perfil'"></app-user-dashboard>
        </main>

      </div>
    </ng-container>
  `
})
export class App implements OnInit {
  vistaActual = 'home';
  rolUsuario = '';
  inicialesUsuario = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.vistaActual = 'home';
  }

  esVistaAdmin(): boolean {
    const vistasExcluidas = ['home', 'login', 'register', 'dashboard-user', 'dashboard-mechanic', 'dashboard-client'];
    return !vistasExcluidas.includes(this.vistaActual);
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  cambiarVistaDespuesLogin() {
    const sesion = localStorage.getItem('sesion');
    if (!sesion) {
      this.vistaActual = 'login';
      return;
    }

    const usuario = JSON.parse(sesion);
    this.rolUsuario = usuario.rol;
    this.inicialesUsuario = this.obtenerIniciales(usuario.nombre || usuario.email || '');

    if (usuario.rol === 'ADMIN') {
      this.vistaActual = 'inicio';
    } else if (usuario.rol === 'USER') {
      this.vistaActual = 'dashboard-user';
    } else if (usuario.rol === 'MECHANIC') {
      this.vistaActual = 'dashboard-mechanic';
    } else if (usuario.rol === 'CLIENT') {
      this.vistaActual = 'dashboard-client';
    } else {
      this.vistaActual = 'login';
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesion');
    this.rolUsuario = '';
    this.inicialesUsuario = '';
    this.vistaActual = 'login';
  }

  private obtenerIniciales(nombre: string): string {
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }
}