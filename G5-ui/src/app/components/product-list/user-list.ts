import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; }

    .admin-container {
      width: 100%;
      max-width: 1200px;
      margin: 1.5rem auto;
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
      flex: 1 1 260px;
      max-width: 360px;
    }

    .filter-select-wrapper {
      flex: 0 0 180px;
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
    }
    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #FACC15;
      box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.15);
    }
    .filter-select option { background: #141414; color: #fff; }

    .table-count {
      font-size: .85rem;
      font-weight: 600;
      color: #aaa;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0;
      white-space: nowrap;
    }
    .table-count strong { color: #FACC15; font-size: 1rem; }

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
    .admin-table tr { display: block; border-bottom: 1px solid #222; padding: 1rem; background: #0d0d0d; }
    .admin-table td { display: flex; justify-content: space-between; align-items: center; padding: .4rem 0; color: #ccc; border: none; }
    .admin-table td::before { content: attr(data-label); font-weight: 600; color: #777; font-size: .8rem; text-transform: uppercase; }

    @media (min-width: 992px) {
      .admin-table { display: table; }
      .admin-table thead { display: table-header-group; background: #050505; border-bottom: 2px solid #FACC15; }
      .admin-table tr { display: table-row; background: transparent; padding: 0; }
      .admin-table tr:hover { background: #141414; }
      .admin-table th {
        display: table-cell;
        color: #FACC15;
        padding: 0.7rem 1.5rem;
        font-size: .8rem;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        font-family: 'Oswald', sans-serif;
        white-space: nowrap;
      }
      .admin-table th:nth-child(1) { width: 30%; }
      .admin-table th:nth-child(2) { width: 35%; }
      .admin-table th:nth-child(3) { width: 15%; }
      .admin-table th:nth-child(4) { width: 20%; }

      .admin-table td { display: table-cell; padding: 0.7rem 1.5rem; border-bottom: 1px solid #161616; vertical-align: middle; }
      .admin-table td::before { display: none; }
      .admin-table tr:last-child td { border-bottom: none; }
    }

    .badge {
      display: inline-block;
      padding: .25rem .65rem;
      border-radius: 4px;
      font-size: .75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-admin { background: #FACC15; color: #000; }
    .badge-user  { background: rgba(250,204,21,0.1); color: #FACC15; border: 1px solid rgba(250,204,21,0.25); }
    .badge-mechanic { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
    .badge-client { background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }

    .actions { display: flex !important; flex-direction: row !important; align-items: center; gap: 0.5rem; flex-wrap: nowrap; justify-content: flex-end; }

    .btn { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; border: none; padding: .5rem 1.25rem; border-radius: 6px; cursor: pointer; transition: all .15s ease; font-size: .85rem; letter-spacing: 0.5px; white-space: nowrap; }
    .btn-primary { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; }
    .btn-edit { background: transparent; color: #FACC15; border: 1px solid #332800; }
    .btn-edit:hover { background: rgba(250,204,21,0.08); }
    .btn-delete { background: transparent; color: #f87171; border: 1px solid #3a1f1f; }
    .btn-delete:hover { background: rgba(248,113,113,0.08); }
    .btn-cancel { background: #1a1a1a; color: #ccc; border: 1px solid #2a2a2a; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; overflow-y: auto; }
    .modal-content { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 2rem; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }

    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
    .form-group label { font-size: .75rem; font-weight: 600; color: #FACC15; letter-spacing: 1px; text-transform: uppercase; }
    .form-control { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; font-size: .95rem; padding: .7rem .9rem; width: 100%; font-family: 'Inter', system-ui, sans-serif; }
    .form-control:focus { outline: none; border-color: #FACC15; }

    .empleado-section {
      background: #0f0f0f;
      border: 1px dashed #333;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 0.5rem;
    }

    .alert-error { padding: 1rem; border-radius: 8px; font-size: 0.9rem; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .loading, .empty { text-align: center; padding: 4rem 1rem; color: #666; font-size: 1rem; }
  `],
  template: `
    <div class="admin-container">

      <div class="header-container">
        <div class="top-row">
          <div class="title-section">
            <h2>Gestión de <span>Usuarios</span></h2>
            <p class="title-sub">Administrá las cuentas de acceso del sistema</p>
          </div>
          <button class="btn btn-primary" (click)="abrirCrear()">+ Nuevo Usuario</button>
        </div>

        <div class="filters-row">
          <div class="search-wrapper">
            <input
              type="text"
              class="search-input"
              placeholder="Buscar usuario por nombre..."
              [ngModel]="filtroNombre()"
              (ngModelChange)="filtroNombre.set($event)">
          </div>

          <div class="filter-select-wrapper">
            <select
              class="filter-select"
              [ngModel]="filtroRol()"
              (ngModelChange)="filtroRol.set($event)">
              <option value="">Todos los roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">Usuario</option>
              <option value="CLIENT">Cliente</option>
              <option value="MECHANIC">Mecánico</option>
            </select>
          </div>

          <p class="table-count">
            Resultados: <strong>{{ usuariosFiltrados().length }}</strong> usuarios
          </p>
        </div>
      </div>

      <div *ngIf="cargando" class="loading">Cargando usuarios...</div>
      <div class="alert-error" *ngIf="errorMensaje && !mostrarModal">⚠️ {{ errorMensaje }}</div>

      <div class="table-wrapper" *ngIf="!cargando">
        <table class="admin-table" *ngIf="usuariosFiltrados().length > 0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th style="text-align: right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuariosFiltrados()">
              <td data-label="Nombre" style="color:#fff; font-weight:600; font-size:1.05rem;">
                {{ usuario.nombre || usuario.username }}
              </td>
              <td data-label="Email" style="color:#aaa;">{{ usuario.email }}</td>
              <td data-label="Rol">
                <span class="badge"
                  [class.badge-admin]="obtenerRolString(usuario) === 'ADMIN'"
                  [class.badge-user]="obtenerRolString(usuario) === 'USER'"
                  [class.badge-client]="obtenerRolString(usuario) === 'CLIENT'"
                  [class.badge-mechanic]="obtenerRolString(usuario) === 'MECHANIC'">
                  {{ obtenerRolString(usuario) }}
                </span>
              </td>
              <td data-label="Acciones" class="actions">
                <button class="btn btn-edit" (click)="abrirEditar(usuario)">Editar</button>
                <button class="btn btn-delete" (click)="eliminarUsuario(usuario.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="usuariosFiltrados().length === 0" class="empty">
          {{ filtroNombre() || filtroRol()
            ? 'No se encontraron usuarios con los filtros aplicados.'
            : 'No hay usuarios registrados en el sistema actualmente.' }}
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="mostrarModal">
      <div class="modal-content">
        <h3 style="margin-top:0; font-size:1.4rem; color:white; text-transform:uppercase;">
          {{ modoEdit ? 'Editar' : 'Nuevo' }} <span style="color:#FACC15;">Usuario</span>
        </h3>
        <hr style="border-color:#1f1f1f; margin-bottom:1.5rem;">

        <div class="alert-error" *ngIf="errorMensaje">⚠️ {{ errorMensaje }}</div>

        <form (ngSubmit)="guardarUsuario()">
          <div class="form-group">
            <label>Nombre Completo</label>
            <input type="text" class="form-control" [(ngModel)]="usuarioForm.nombre" name="nombre" placeholder="Ej. Ayelen Alva">
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" class="form-control" [(ngModel)]="usuarioForm.email" name="email" placeholder="correo@ejemplo.com">
          </div>
          <div class="form-group" *ngIf="!modoEdit">
            <label>Contraseña (Mínimo 6 caracteres)</label>
            <input type="password" class="form-control" [(ngModel)]="usuarioForm.contrasenia" name="contrasenia" placeholder="******">
          </div>
          <div class="form-group">
            <label>Rol asignado</label>
            <select class="form-control" [(ngModel)]="usuarioForm.rol.nombreRol" name="nombreRol">
              <option value="USER">USER (Usuario)</option>
              <option value="CLIENT">CLIENT (Cliente)</option>
              <option value="MECHANIC">MECHANIC (Mecánico)</option>
              <option value="ADMIN">ADMIN (Administrador)</option>
            </select>
          </div>

          <div class="empleado-section" *ngIf="usuarioForm.rol.nombreRol === 'MECHANIC'">
            <h4 style="color: #FACC15; font-size: 0.8rem; margin: 0 0 1rem 0; text-transform: uppercase; letter-spacing: 0.5px;">
              Información Laboral (Mecánico)
            </h4>
            <div class="form-group">
              <label>Sueldo Mensual ($)</label>
              <input type="number" class="form-control" [(ngModel)]="usuarioForm.empleado.sueldo" name="sueldo" placeholder="Ej: 250000">
            </div>
            <div class="form-group">
              <label>Días de Trabajo</label>
              <input type="text" class="form-control" [(ngModel)]="usuarioForm.empleado.diasTrabajo" name="diasTrabajo" placeholder="Ej: Lunes a Viernes">
            </div>
            <div class="form-group">
              <label>Horario Laboral</label>
              <input type="text" class="form-control" [(ngModel)]="usuarioForm.empleado.horarioTrabajo" name="horarioTrabajo" placeholder="Ej: 08:00 a 17:00">
            </div>
            <div class="form-group">
              <label>Días Libres</label>
              <input type="text" class="form-control" [(ngModel)]="usuarioForm.empleado.diasLibres" name="diasLibres" placeholder="Ej: Sábado y Domingo">
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-top:1.5rem; gap:.5rem;">
            <button type="button" class="btn btn-cancel" (click)="cerrarModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">
              {{ modoEdit ? 'Actualizar Cambios' : 'Registrar Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  usuarios = signal<any[]>([]);
  cargando = false;
  mostrarModal = false;
  modoEdit = false;
  errorMensaje = '';
  usuarioForm: any = this.resetForm();

  filtroNombre = signal<string>('');
  filtroRol = signal<string>('');

  usuariosFiltrados = computed(() => {
    const texto = this.filtroNombre().trim().toLowerCase();
    const rol = this.filtroRol();

    return this.usuarios().filter(u => {
      const rolStr = this.obtenerRolString(u);
      const coincideNombre = !texto || (u.nombre || u.username || '').toLowerCase().includes(texto);
      const coincideRol = !rol || rolStr === rol;
      return coincideNombre && coincideRol;
    });
  });

  private userService = inject(UserService);

  ngOnInit() { this.cargarUsuarios(); }

  resetForm() {
    return {
      id: null,
      nombre: '',
      email: '',
      contrasenia: '',
      rol: { nombreRol: 'USER' },
      empleado: { sueldo: null, diasTrabajo: '', horarioTrabajo: '', diasLibres: '' }
    };
  }

  obtenerRolString(usuario: any): string {
    return usuario.rol?.nombreRol || usuario.rol?.nombre || usuario.rol || 'USER';
  }

  cargarUsuarios() {
    this.cargando = true;
    this.userService.getUsers().subscribe({
      next: (data: any) => { this.usuarios.set(Array.isArray(data) ? data : []); this.cargando = false; },
      error: (err: any) => { console.error('Error al obtener usuarios:', err); this.cargando = false; }
    });
  }

  abrirCrear() {
    this.modoEdit = false;
    this.errorMensaje = '';
    this.usuarioForm = this.resetForm();
    this.mostrarModal = true;
  }

  abrirEditar(usuario: any) {
    this.modoEdit = true;
    this.errorMensaje = '';

    this.usuarioForm = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: { nombreRol: this.obtenerRolString(usuario) },
      empleado: usuario.empleado ? { ...usuario.empleado } : { sueldo: null, diasTrabajo: '', horarioTrabajo: '', diasLibres: '' }
    };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; this.errorMensaje = ''; this.usuarioForm = this.resetForm(); }

  validarFormulario(): boolean {
    const { nombre, email, contrasenia, rol, empleado } = this.usuarioForm;
    if (!nombre?.trim() || !email?.trim()) { this.errorMensaje = 'Por favor, complete todos los campos obligatorios.'; return false; }
    if (!this.modoEdit && (!contrasenia || contrasenia.length < 6)) { this.errorMensaje = 'La contraseña debe tener al menos 6 caracteres.'; return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.errorMensaje = 'El formato del correo electrónico no es válido.'; return false; }

    // Validación extra si es mecánico
    if (rol.nombreRol === 'MECHANIC') {
      if (!empleado.sueldo || !empleado.diasTrabajo.trim() || !empleado.horarioTrabajo.trim()) {
        this.errorMensaje = 'Por favor, complete los datos laborales del mecánico.';
        return false;
      }
    }

    this.errorMensaje = '';
    return true;
  }

  guardarUsuario() {
    if (!this.validarFormulario()) return;

    // Si NO es mecánico, eliminamos la sección 'empleado' del payload para no mandar basura al backend
    const payload = { ...this.usuarioForm };
    if (payload.rol.nombreRol !== 'MECHANIC') {
      delete payload.empleado;
    }

    if (this.modoEdit) {
      this.userService.updateUser(payload.id, payload).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModal(); },
        error: (err: any) => { this.errorMensaje = err.error?.error || 'Error al actualizar el usuario.'; }
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => { this.cargarUsuarios(); this.cerrarModal(); },
        error: (err: any) => { this.errorMensaje = err.error?.error || 'Error al registrar el usuario.'; }
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.cargarUsuarios(),
        error: (err: any) => console.error('Error al eliminar:', err)
      });
    }
  }
}
