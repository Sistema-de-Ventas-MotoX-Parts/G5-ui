import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MotocicletaService } from '../../services/motocicleta.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-motocicletas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght=400;600;700&family=Inter:wght=400;500;600&display=swap');

    * { box-sizing: border-box; }

    .admin-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      font-family: 'Inter', sans-serif;
    }

    .header-container {
      margin-bottom: 2rem;
      border-bottom: 1px solid #1f1f1f;
      padding-bottom: 1rem;
    }

    .title {
      font-family: 'Oswald', sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      margin: 0 0 1rem 0;
    }
    .title span { color: #FACC15; }

    .actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .search-control {
      background: #111;
      border: 1px solid #222;
      border-radius: 6px;
      color: #fff;
      padding: .5rem 1rem;
      font-size: .85rem;
      width: 280px;
    }
    .search-control:focus { outline: none; border-color: #FACC15; }

    .table-wrapper { border: 1px solid #1f1f1f; border-radius: 10px; overflow: hidden; background: #111; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: .88rem; text-align: left; }
    .admin-table thead tr { background: #0a0a0a; border-bottom: 2px solid #FACC15; }
    .admin-table th { font-family: 'Oswald', sans-serif; color: #FACC15; padding: .85rem 1.25rem; font-size: .72rem; letter-spacing: 1.5px; text-transform: uppercase; }
    .admin-table td { color: #ccc; padding: .85rem 1.25rem; border-bottom: 1px solid #161616; vertical-align: middle; }
    .admin-table tr:hover { background: #161616; }

    .patente-badge { background: #222; color: #fff; border: 1px solid #444; padding: .2rem .5rem; border-radius: 4px; font-weight: bold; letter-spacing: 1px; }

    .btn { font-family: 'Oswald', sans-serif; font-weight: 700; text-transform: uppercase; border: none; padding: .5rem 1.25rem; border-radius: 5px; cursor: pointer; transition: background .15s; font-size: .75rem; }
    .btn-primary { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; }
    .btn-edit { background: transparent; color: #FACC15; border: 1px solid #332800; margin-right: .5rem; }
    .btn-edit:hover { background: rgba(250,204,21,0.1); }
    .btn-delete { background: transparent; color: #f87171; border: 1px solid #3a1f1f; }
    .btn-delete:hover { background: rgba(248,113,113,0.1); }
    .btn-cancel { background: #2a2a2a; color: #ccc; margin-left: .5rem; }

    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #111; border: 1px solid #2a2a2a; border-radius: 10px; padding: 2rem; width: 100%; max-width: 480px; }

    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .5rem; }
    .form-group label { font-size: .72rem; font-weight: 600; color: #FACC15; letter-spacing: 1.5px; text-transform: uppercase; }
    .form-control { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; color: #e5e5e5; font-size: .88rem; padding: .6rem .85rem; width: 100%; }
    .form-control:focus { outline: none; border-color: #FACC15; }

    .alert-error { padding: .75rem; border-radius: 6px; font-size: 0.85rem; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .empty-state { text-align: center; padding: 3rem 1rem; color: #555; font-size: .9rem; }
  `],
  template: `
    <div class="admin-container">

      <div class="header-container">
        <h2 class="title">Control de <span>Motocicletas</span></h2>

        <div class="actions-row">
          <input
            type="text"
            class="search-control"
            placeholder="Buscar por Patente..."
            [(ngModel)]="filtroPatente"
            (ngModelChange)="filtrarMotos()"
          >
          <button class="btn btn-primary" (click)="abrirModalCrear()">+ Registrar Moto</button>
        </div>
      </div>

      <div class="alert-error" *ngIf="errorLista">⚠️ {{ errorLista }}</div>

      <div class="table-wrapper">
        <table class="admin-table" *ngIf="motosFiltradas.length > 0">
          <thead>
            <tr>
              <th>Patente / Dominio</th>
              <th>Propietario (DNI)</th>
              <th>Marca / Modelo</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of motosFiltradas">
              <td><span class="patente-badge">{{ m.patente | uppercase }}</span></td>
              <td style="color: #fff;">{{ m.dni || 'N/A' }}</td>
              <td style="color: #fff; font-weight: 600;">
                {{ m.marca?.nombre || m.marca || 'S/M' }} - {{ m.modelo?.nombre || m.modelo || 'S/M' }}
              </td>
              
              <td style="color: #888; font-size: 0.85rem;">
                {{ (m.fechaSubida || m.fecha_subida || fechaHoyFallback) | date:'dd/MM/yyyy' }}
              </td>
              
              <td>
                <button class="btn btn-edit" (click)="abrirModalEditar(m)">Editar</button>
                <button class="btn btn-delete" (click)="eliminar(m.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="motosFiltradas.length === 0" class="empty-state">
          No se encontraron motocicletas que coincidan con la búsqueda.
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="mostrarModal">
      <div class="modal-content">
        <h3 style="margin-top:0; font-size:1.4rem; color: white; text-transform: uppercase; font-family:'Oswald', sans-serif;">
          {{ modoEdit ? 'Modificar Moto ' : 'Nueva Motocicleta ' }}
        </h3>
        <hr style="border-color: #1f1f1f; margin-bottom: 1.5rem;">

        <div class="alert-error" *ngIf="errorModal">⚠️ {{ errorModal }}</div>

        <form (ngSubmit)="guardar()">
          
          <div class="form-group">
            <label>Patente (Dominio)</label>
            <input type="text" class="form-control" [(ngModel)]="form.patente" name="patente" placeholder="Ej. ABC123D" [disabled]="modoEdit">
          </div>

          <div class="form-group">
            <label>DNI del Propietario (8 números)</label>
            <input type="text" class="form-control" [(ngModel)]="form.dni" name="dni" placeholder="Ej. 40123456" maxlength="8">
          </div>

          <div class="form-group">
            <label>Marca de la Moto</label>
            <select class="form-control" [(ngModel)]="form.idMarca" name="idMarca" (change)="onMarcaChange()">
              <option [value]="null" disabled selected>Seleccione una marca...</option>
              <option *ngFor="let m of listaMarcas" [value]="m.id" [disabled]="!esMarcaActiva(m)">
                {{ m.nombre }} {{ !esMarcaActiva(m) ? '(DESACTIVADA)' : '' }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Modelo de la Moto</label>
            <select class="form-control" [(ngModel)]="form.idModelo" name="idModelo" [disabled]="!form.idMarca">
              <option [value]="null" disabled selected>Seleccione un modelo...</option>
              <option *ngFor="let mod of modelosFiltradosPorMarca" [value]="mod.id" [disabled]="!esModeloActivo(mod)">
                {{ mod.nombre }} {{ !esModeloActivo(mod) ? '(DESACTIVADO)' : '' }}
              </option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
            <button type="button" class="btn btn-cancel" (click)="cerrarModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="margin-left: 0.5rem;">
              {{ modoEdit ? 'Guardar Cambios' : 'Registrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminMotocicletasComponent implements OnInit {
  motos: any[] = [];
  motosFiltradas: any[] = [];
  filtroPatente = '';
  mostrarModal = false;
  modoEdit = false;
  idSeleccionado: number | null = null;
  errorLista = '';
  errorModal = '';
  
  // Guardamos la fecha de hoy para renderizarla si el back viene nulo
  fechaHoyFallback = new Date();

  listaMarcas: any[] = [];
  listaModelosAll: any[] = [];
  modelosFiltradosPorMarca: any[] = [];

  private motoService = inject(MotocicletaService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  form = {
    patente: '',
    dni: '',
    idMarca: null as number | null,
    idModelo: null as number | null
  };

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.obtenerToken()}` });
  }

  ngOnInit() {
    this.cargarMotos();
    this.cargarEstructurasAuxiliares();
  }

  cargarMotos() {
    this.errorLista = '';
    this.motoService.listarTodas().subscribe({
      next: (res: any[]) => {
        this.motos = res;
        this.motosFiltradas = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorLista = 'Error al traer las motocicletas de la base de datos.';
        console.error(err);
      }
    });
  }

  cargarEstructurasAuxiliares() {
    this.http.get<any[]>('http://localhost:8080/api/marcas', { headers: this.getHeaders() }).subscribe(data => this.listaMarcas = data);
    this.http.get<any[]>('http://localhost:8080/api/modelos', { headers: this.getHeaders() }).subscribe(data => this.listaModelosAll = data);
  }

  onMarcaChange() {
    this.form.idModelo = null;
    if (!this.form.idMarca) {
      this.modelosFiltradosPorMarca = [];
      return;
    }
    const marcaId = Number(this.form.idMarca);
    this.modelosFiltradosPorMarca = this.listaModelosAll.filter(m => Number(m.marca?.id || m.idMarca) === marcaId);
    this.cdr.detectChanges();
  }

  esMarcaActiva(marca: any): boolean {
    const estadosLocales = localStorage.getItem('motos_marcas_estados');
    if (estadosLocales) {
      const tablaEstados = JSON.parse(estadosLocales);
      if (tablaEstados[marca.id] !== undefined) return tablaEstados[marca.id];
    }
    return marca.activo !== false;
  }

  esModeloActivo(modelo: any): boolean {
    const estadosLocales = localStorage.getItem('motos_modelos_estados');
    if (estadosLocales) {
      const tablaEstados = JSON.parse(estadosLocales);
      if (tablaEstados[modelo.id] !== undefined) return tablaEstados[modelo.id];
    }
    return modelo.activo !== false;
  }

  filtrarMotos() {
    if (!this.filtroPatente.trim()) {
      this.motosFiltradas = this.motos;
    } else {
      this.motosFiltradas = this.motos.filter(m =>
        m.patente?.toLowerCase().includes(this.filtroPatente.toLowerCase())
      );
    }
    this.cdr.detectChanges();
  }

  abrirModalCrear() {
    this.modoEdit = false;
    this.errorModal = '';
    this.idSeleccionado = null;
    this.form = { patente: '', dni: '', idMarca: null, idModelo: null };
    this.modelosFiltradosPorMarca = [];
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  abrirModalEditar(moto: any) {
    this.modoEdit = true;
    this.errorModal = '';
    this.idSeleccionado = moto.id;
    const marcaId = moto.marca?.id || null;

    this.form = {
      patente: moto.patente ? String(moto.patente).toUpperCase() : '',
      dni: moto.dni || '',
      idMarca: marcaId,
      idModelo: moto.modelo?.id || null
    };

    if (marcaId) {
      this.modelosFiltradosPorMarca = this.listaModelosAll.filter(m => Number(m.marca?.id || m.idMarca) === Number(marcaId));
    } else {
      this.modelosFiltradosPorMarca = [];
    }

    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  guardar() {
    this.errorModal = '';

    if (!this.form.patente || !this.form.patente.trim()) { this.errorModal = 'La patente es obligatoria.'; return; }
    if (!this.form.dni || !this.form.dni.trim()) { this.errorModal = 'El DNI es obligatorio.'; return; }
    if (!this.form.idMarca) { this.errorModal = 'Debe seleccionar una marca.'; return; }
    if (!this.form.idModelo) { this.errorModal = 'Debe seleccionar un modelo válido.'; return; }

    const dniLimpio = this.form.dni.trim();

    // 🌟 VALIDACIÓN DEL DNI: Puros números y largo de 8 caracteres
    const regexDni = /^[0-9]{8}$/;
    if (!regexDni.test(dniLimpio)) {
      this.errorModal = 'El DNI debe tener exactamente 8 caracteres numéricos (sin letras, espacios ni puntos).';
      return;
    }

    const patenteNueva = this.form.patente.trim().toUpperCase();

    if (!this.modoEdit) {
      const existePatente = this.motos.some(m => m.patente?.trim().toUpperCase() === patenteNueva);
      if (existePatente) {
        this.errorModal = `La patente "${patenteNueva}" ya está registrada en el sistema.`;
        return;
      }
    }

    const hoyStr = new Date().toISOString().split('T')[0];
    const idMarcaNum = Number(this.form.idMarca);
    const idModeloNum = Number(this.form.idModelo);

    const payload = {
      patente: patenteNueva,
      dni: dniLimpio,
      fechaSubida: hoyStr,
      idMarca: idMarcaNum,
      marcaId: idMarcaNum,
      idModelo: idModeloNum,
      modeloId: idModeloNum,
      marca: { id: idMarcaNum },
      modelo: { id: idModeloNum }
    };

    if (this.modoEdit && this.idSeleccionado !== null) {
      this.motoService.actualizar(this.idSeleccionado, payload).subscribe({
        next: () => { this.cerrarModal(); this.cargarMotos(); },
        error: (err: any) => {
          this.errorModal = err.error?.mensaje || err.error?.error || 'Error al actualizar.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.http.post('http://localhost:8080/api/motocicletas', payload, { headers: this.getHeaders() }).subscribe({
        next: () => { this.cerrarModal(); this.cargarMotos(); },
        error: (err: any) => {
          if (err.error && typeof err.error === 'object') {
            this.errorModal = Object.values(err.error).join(', ');
          } else {
            this.errorModal = err.error?.mensaje || err.error?.error || 'Error al registrar.';
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que desea eliminar esta motocicleta de forma permanente?')) {
      this.motoService.eliminar(id).subscribe({
        next: () => { this.cargarMotos(); },
        error: (err: any) => { alert('No se pudo eliminar el vehículo.'); console.error(err); }
      });
    }
  }
}