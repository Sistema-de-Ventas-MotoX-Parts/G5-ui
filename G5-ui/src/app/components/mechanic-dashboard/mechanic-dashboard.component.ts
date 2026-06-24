import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Inter', system-ui, sans-serif;
      background: #050505;
      color: #fff;
    }

    /* ── NAV ── */
    .mechanic-nav {
      height: 60px;
      background: #0a0a0a;
      border-bottom: 1px solid #1f1f1f;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 100;
    }

    .nav-brand {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .nav-brand-title {
      font-family: 'Oswald', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #fff;
    }
    .nav-brand-title span { color: #FACC15; }
    .nav-brand-sub {
      font-size: .6rem;
      color: #444;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .nav-greeting { font-size: .85rem; color: #666; }
    .nav-greeting strong { color: #FACC15; }

    .btn-logout-nav {
      font-family: 'Oswald', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      font-size: .75rem;
      letter-spacing: .5px;
      background: transparent;
      color: #f87171;
      border: 1px solid rgba(248,113,113,0.3);
      padding: .4rem .9rem;
      border-radius: 5px;
      cursor: pointer;
      transition: all .15s;
      display: flex;
      align-items: center;
      gap: .4rem;
    }
    .btn-logout-nav:hover { background: rgba(248,113,113,0.08); }

    /* ── LAYOUT ── */
    .main-layout {
      display: flex;
      flex: 1;
      margin-top: 60px;
    }

    /* ── SIDEBAR ── */
    .mechanic-sidebar {
      width: 230px;
      background: #0a0a0a;
      border-right: 1px solid #1f1f1f;
      padding: 1.75rem .75rem 1.5rem;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 60px;
      bottom: 0;
      left: 0;
      z-index: 90;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: 0 .5rem 1.5rem;
      border-bottom: 1px solid #141414;
      margin-bottom: 1.25rem;
    }
    .sidebar-logo img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      border-radius: 6px;
    }
    .sidebar-logo-text {
      font-family: 'Oswald', sans-serif;
      font-size: .85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .5px;
      color: #555;
    }

    .menu-label {
      font-size: .62rem;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: .5rem .75rem;
    }

    .sidebar-menu { display: flex; flex-direction: column; gap: .25rem; }

    .menu-item {
      font-family: 'Oswald', sans-serif;
      font-size: .9rem;
      text-transform: uppercase;
      letter-spacing: .5px;
      padding: .6rem .75rem;
      color: #666;
      background: transparent;
      border: none;
      border-radius: 6px;
      text-align: left;
      cursor: pointer;
      transition: all .15s;
      display: flex;
      align-items: center;
      gap: .65rem;
      width: 100%;
    }
    .menu-item:hover { color: #ccc; background: #141414; }
    .menu-item.active { color: #000; background: #FACC15; }

    .sidebar-divider {
      border: none;
      border-top: 1px solid #141414;
      margin: 1rem .5rem;
    }

    .sidebar-bottom { margin-top: auto; }

    .profile-btn {
      font-family: 'Oswald', sans-serif;
      font-size: .88rem;
      text-transform: uppercase;
      letter-spacing: .5px;
      padding: .6rem .75rem;
      color: #555;
      background: transparent;
      border: none;
      border-radius: 6px;
      text-align: left;
      cursor: pointer;
      transition: all .15s;
      display: flex;
      align-items: center;
      gap: .65rem;
      width: 100%;
    }
    .profile-btn:hover { color: #aaa; }
    .profile-btn.active { color: #000; background: #FACC15; }

    /* ── CONTENIDO ── */
    .content-area {
      flex: 1;
      margin-left: 230px;
      padding: 2rem;
      padding-bottom: 70px;
    }

    /* Saludo */
    .greeting-bar { margin-bottom: 2rem; }
    .greeting-bar h2 {
      font-family: 'Oswald', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
      letter-spacing: .5px;
    }
    .greeting-bar h2 span { color: #FACC15; }
    .greeting-bar p { color: #444; font-size: .78rem; margin-top: .3rem; text-transform: uppercase; letter-spacing: 1.5px; }

    /* Cards de ficha */
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .info-card {
      background: #0d0d0d;
      border: 1px solid #1a1a1a;
      border-left: 3px solid #FACC15;
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
    }
    .info-card h4 {
      color: #555;
      font-size: .68rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 .5rem 0;
    }
    .info-card p {
      font-size: 1.15rem;
      font-weight: 600;
      color: #e5e5e5;
      margin: 0;
    }

    /* Calendario */
    .calendar-box {
      background: #0d0d0d;
      border: 1px solid #1a1a1a;
      border-radius: 12px;
      padding: 1.5rem;
      max-width: 480px;
    }

    .cal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .cal-month {
      font-family: 'Oswald', sans-serif;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: .5px;
      color: #fff;
    }
    .cal-nav { display: flex; gap: .4rem; }
    .cal-nav button {
      background: #141414;
      border: 1px solid #222;
      color: #aaa;
      width: 26px; height: 26px;
      border-radius: 4px;
      font-size: .85rem;
      cursor: pointer;
      transition: all .15s;
      display: flex; align-items: center; justify-content: center;
    }
    .cal-nav button:hover { border-color: #FACC15; color: #FACC15; }

    .cal-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      text-align: center;
    }
    .cal-day-name {
      font-size: .65rem;
      color: #444;
      text-transform: uppercase;
      padding: .3rem 0;
    }
    .cal-day {
      font-size: .8rem;
      color: #555;
      padding: .4rem;
      border-radius: 5px;
      cursor: pointer;
      transition: background .1s;
    }
    .cal-day:hover { background: #141414; color: #aaa; }
    .cal-day.work { background: rgba(250,204,21,0.07); color: #FACC15; }
    .cal-day.today { background: #FACC15 !important; color: #000 !important; font-weight: 700; }
    .cal-day.off { color: #333; }
    .cal-day.empty { pointer-events: none; }

    .cal-legend { display: flex; gap: 1.25rem; margin-top: 1rem; }
    .cal-legend span { font-size: .7rem; color: #555; display: flex; align-items: center; gap: .4rem; }
    .legend-dot { display: inline-block; width: 8px; height: 8px; border-radius: 2px; }

    /* Sección de título */
    .section-title {
      font-family: 'Oswald', sans-serif;
      font-size: 1.8rem;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      color: #FACC15;
      letter-spacing: .5px;
      border-bottom: 1px solid #1f1f1f;
      padding-bottom: .75rem;
    }

    .panel-box {
      background: #0d0d0d;
      border: 1px solid #222;
      border-radius: 12px;
      padding: 2rem;
    }

    /* Formulario perfil */
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
    .form-group label { font-size: .72rem; font-weight: 600; color: #666; letter-spacing: 1px; text-transform: uppercase; }
    .form-control { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; font-size: .92rem; padding: .7rem .9rem; width: 100%; font-family: 'Inter', system-ui, sans-serif; }
    .form-control:focus { outline: none; border-color: #FACC15; }

    .btn-submit {
      font-family: 'Oswald', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      border: none;
      padding: .65rem 2rem;
      border-radius: 5px;
      cursor: pointer;
      background: #FACC15;
      color: #000;
      font-size: .88rem;
      transition: all .15s;
      letter-spacing: .5px;
    }
    .btn-submit:hover { background: #EAB308; }
    .btn-submit:disabled { opacity: .5; cursor: not-allowed; }

    /* Alertas */
    .alert-success { padding: .9rem; border-radius: 6px; font-size: .88rem; background: rgba(74,222,128,0.1); border: 1px solid #4ade80; color: #4ade80; margin-bottom: 1.25rem; }
    .alert-error   { padding: .9rem; border-radius: 6px; font-size: .88rem; background: rgba(239,68,68,0.1);  border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }

    /* Footer */
    .mechanic-footer {
      height: 46px;
      background: #0a0a0a;
      border-top: 1px solid #1f1f1f;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: .75rem;
      color: #333;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 230px;
      z-index: 100;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .mechanic-sidebar { width: 60px; padding: 1rem .35rem; }
      .sidebar-logo, .menu-label, .sidebar-logo-text { display: none; }
      .menu-item span:last-child, .profile-btn span:last-child { display: none; }
      .menu-item, .profile-btn { justify-content: center; padding: .65rem; }
      .content-area { margin-left: 60px; padding: 1rem; }
      .mechanic-footer { left: 60px; }
      .nav-greeting { display: none; }
    }
  `],
  template: `
    <div class="dashboard-wrapper">

      <!-- NAV -->
      <nav class="mechanic-nav">
        <div class="nav-brand">
          <span class="nav-brand-title">Moto<span>X</span> Parts</span>
          <span class="nav-brand-sub">{{ panelLabel() }}</span>
        </div>
        <div class="nav-right">
          <span class="nav-greeting">Hola, <strong>{{ miPerfil()?.nombre }}</strong></span>
          <button class="btn-logout-nav" (click)="salir()">
            🚪 Salir
          </button>
        </div>
      </nav>

      <div class="main-layout">

        <!-- SIDEBAR -->
        <aside class="mechanic-sidebar">

          <!-- Logo -->
          <div class="sidebar-logo">
            <img src="img/image.png" alt="MotoX logo">
            <span class="sidebar-logo-text">MotoX Parts</span>
          </div>

          <!-- Menú principal -->
          <span class="menu-label">Principal</span>
          <div class="sidebar-menu">
            <button class="menu-item" [class.active]="vistaInterna() === 'inicio'" (click)="vistaInterna.set('inicio')">
              <span>🏠</span><span>Inicio</span>
            </button>
            <button class="menu-item" [class.active]="vistaInterna() === 'trabajo'" (click)="vistaInterna.set('trabajo')">
              <span>🔧</span><span>Mis Órdenes</span>
            </button>
          </div>

          <hr class="sidebar-divider">

          <!-- Perfil al fondo -->
          <div class="sidebar-bottom">
            <button class="profile-btn" [class.active]="vistaInterna() === 'perfil'" (click)="vistaInterna.set('perfil')">
              <span>👤</span><span>Mi Perfil</span>
            </button>
          </div>

        </aside>

        <!-- CONTENIDO -->
        <main class="content-area">

          <!-- INICIO -->
          <div *ngIf="vistaInterna() === 'inicio'">
            <div class="greeting-bar">
              <h2>Hola, <span>{{ primerNombre() }}</span> 👋</h2>
              <p>{{ fechaHoy() }} · Panel mecánico</p>
            </div>

            <div class="profile-grid">
              <div class="info-card">
                <h4>Sueldo Base</h4>
                <p *ngIf="miPerfil()?.empleado?.sueldo">\${{ miPerfil()?.empleado?.sueldo | number:'1.0-0' }}</p>
                <p *ngIf="!miPerfil()?.empleado?.sueldo" style="color:#444">No disponible</p>
              </div>
              <div class="info-card">
                <h4>Días de Trabajo</h4>
                <p>{{ miPerfil()?.empleado?.diasTrabajo || 'No asignado' }}</p>
              </div>
              <div class="info-card">
                <h4>Horario Laboral</h4>
                <p>{{ miPerfil()?.empleado?.horarioTrabajo || 'No asignado' }}</p>
              </div>
              <div class="info-card">
                <h4>Días Libres</h4>
                <p>{{ miPerfil()?.empleado?.diasLibres || 'No asignado' }}</p>
              </div>
            </div>

            <!-- Calendario -->
            <div class="calendar-box">
              <div class="cal-header">
                <span class="cal-month">{{ mesNombre() }} {{ anioActual }}</span>
                <div class="cal-nav">
                  <button (click)="cambiarMes(-1)">&#8249;</button>
                  <button (click)="cambiarMes(1)">&#8250;</button>
                </div>
              </div>
              <div class="cal-grid">
                <div class="cal-day-name" *ngFor="let d of diasSemana">{{ d }}</div>
                <div
                  *ngFor="let dia of diasCalendario()"
                  class="cal-day"
                  [class.empty]="dia === 0"
                  [class.today]="esHoy(dia)"
                  [class.work]="!esHoy(dia) && esDiaTrabajo(dia)"
                  [class.off]="!esHoy(dia) && !esDiaTrabajo(dia) && dia !== 0"
                >
                  {{ dia !== 0 ? dia : '' }}
                </div>
              </div>
              <div class="cal-legend">
                <span><span class="legend-dot" style="background:rgba(250,204,21,0.5)"></span>Día laboral</span>
                <span><span class="legend-dot" style="background:#FACC15"></span>Hoy</span>
                <span><span class="legend-dot" style="background:#222"></span>Libre</span>
              </div>
            </div>
          </div>

          <!-- ÓRDENES -->
          <div *ngIf="vistaInterna() === 'trabajo'">
            <h2 class="section-title">Órdenes de Reparación</h2>
            <div class="panel-box" style="text-align:center; color:#555; padding:4rem 1rem;">
              <p style="margin:0; font-size:1rem">Próximamente se listarán tus reparaciones asignadas aquí.</p>
            </div>
          </div>

          <!-- PERFIL -->
          <div *ngIf="vistaInterna() === 'perfil'">
            <h2 class="section-title">Configuración de Cuenta</h2>
            <div class="panel-box" style="max-width:600px">

              <div class="alert-success" *ngIf="mensajeExito">✅ {{ mensajeExito }}</div>
              <div class="alert-error"   *ngIf="mensajeError">⚠️ {{ mensajeError }}</div>

              <form (ngSubmit)="actualizarPerfil()">
                <div class="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" class="form-control" [(ngModel)]="formPerfil.nombre" name="nombre">
                </div>
                <div class="form-group">
                  <label>Correo Electrónico (No modificable)</label>
                  <input type="email" class="form-control" [value]="miPerfil()?.email" disabled style="opacity:.4; cursor:not-allowed">
                </div>
                <div class="form-group">
                  <label>Nueva Contraseña (Dejar en blanco para conservar la actual)</label>
                  <input type="password" class="form-control" [(ngModel)]="formPerfil.contrasenia" name="contrasenia" placeholder="Mínimo 6 caracteres">
                </div>
                <div style="display:flex; justify-content:flex-end; margin-top:1.5rem;">
                  <button type="submit" class="btn-submit" [disabled]="guardando">
                    {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </main>

        <footer class="mechanic-footer">
          &copy; 2026 MotoX Parts &nbsp;·&nbsp; Panel de Control de Personal Técnico
        </footer>

      </div>
    </div>
  `
})
export class MechanicDashboardComponent implements OnInit {

  miPerfil     = signal<any>(null);
  vistaInterna = signal<string>('inicio');

  guardando    = false;
  mensajeExito = '';
  mensajeError = '';
  formPerfil   = { nombre: '', contrasenia: '' };

  // ── Calendario ──
  readonly diasSemana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  mesActual   = new Date().getMonth();
  anioActual  = new Date().getFullYear();
  private hoy = new Date();

  private http        = inject(HttpClient);
  private authService = inject(AuthService);

  ngOnInit() {
    const sesion = this.authService.obtenerSesion();
    this.miPerfil.set(sesion);
    if (sesion?.id && sesion?.token) {
      this.obtenerDatosCompletos(sesion.id, sesion.token);
    }
  }

  // ── Helpers de saludo ──
  primerNombre(): string {
    const nombre = this.miPerfil()?.nombre || '';
    return nombre.split(' ')[0];
  }

  fechaHoy(): string {
    return new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  panelLabel(): string {
    const map: Record<string, string> = { inicio: 'Panel mecánico', trabajo: 'Mis órdenes', perfil: 'Mi perfil' };
    return map[this.vistaInterna()] ?? 'Panel mecánico';
  }

  // ── Calendario ──
  mesNombre(): string {
    return new Date(this.anioActual, this.mesActual, 1)
      .toLocaleDateString('es-AR', { month: 'long' })
      .replace(/^\w/, c => c.toUpperCase());
  }

  cambiarMes(dir: number) {
    this.mesActual += dir;
    if (this.mesActual > 11) { this.mesActual = 0;  this.anioActual++; }
    if (this.mesActual < 0)  { this.mesActual = 11; this.anioActual--; }
  }

  diasCalendario(): number[] {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    // Lunes=0 en lugar de domingo=0
    const offset = (primerDia + 6) % 7;
    const totalDias = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    const dias: number[] = Array(offset).fill(0);
    for (let i = 1; i <= totalDias; i++) dias.push(i);
    return dias;
  }

  esHoy(dia: number): boolean {
    return dia !== 0
      && dia === this.hoy.getDate()
      && this.mesActual === this.hoy.getMonth()
      && this.anioActual === this.hoy.getFullYear();
  }

  esDiaTrabajo(dia: number): boolean {
    if (dia === 0) return false;
    const dow = new Date(this.anioActual, this.mesActual, dia).getDay();
    // Lunes(1) a Viernes(5) son días laborales por defecto
    // Podés ajustarlo dinámicamente con miPerfil()?.empleado?.diasTrabajo
    return dow >= 1 && dow <= 5;
  }

  // ── HTTP ──
  obtenerDatosCompletos(id: number, token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>('http://localhost:8080/api/usuarios/perfil', { headers }).subscribe({
      next: u => {
        this.miPerfil.set({ ...this.miPerfil(), ...u });
        this.formPerfil.nombre = u.nombre || '';
      },
      error: err => console.error('Error al traer perfil:', err)
    });
  }

  actualizarPerfil() {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.formPerfil.nombre.trim()) { this.mensajeError = 'El nombre no puede quedar vacío.'; return; }
    if (this.formPerfil.contrasenia && this.formPerfil.contrasenia.length < 6) {
      this.mensajeError = 'La contraseña debe tener al menos 6 caracteres.'; return;
    }

    this.guardando = true;
    const headers  = new HttpHeaders({ Authorization: `Bearer ${this.miPerfil().token}` });
    const payload: any = { nombre: this.formPerfil.nombre };
    if (this.formPerfil.contrasenia) payload.contrasenia = this.formPerfil.contrasenia;

    this.http.put<any>('http://localhost:8080/api/usuarios/perfil', payload, { headers }).subscribe({
      next: u => {
        this.guardando    = false;
        this.mensajeExito = 'Perfil actualizado correctamente.';
        this.miPerfil.set({ ...this.miPerfil(), ...u });
        this.authService.guardarSesion(this.miPerfil());
        this.formPerfil.contrasenia = '';
      },
      error: err => {
        this.guardando   = false;
        this.mensajeError = err.error?.error || 'No se pudieron guardar los cambios.';
      }
    });
  }

  salir() {
    this.authService.logout();
    window.location.reload();
  }
}