import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght=400;600;700&family=Inter:wght=400;500;600&display=swap');
    * { box-sizing: border-box; }
    .admin-container { width: 100%; max-width: 1300px; margin: 1.5rem auto; padding: 1.5rem 2rem; font-family: 'Inter', sans-serif; }
    .top-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
    .title-section h2 { font-family: 'Oswald', sans-serif; font-size: 2.3rem; font-weight: 700; color: #fff; text-transform: uppercase; margin: 0; }
    .title-section h2 span { color: #FACC15; }
    
    .table-wrapper { border: 1px solid #222; border-radius: 12px; overflow: hidden; background: #0d0d0d; width: 100%; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: .95rem; text-align: left; }
    .admin-table thead { background: #050505; border-bottom: 2px solid #FACC15; }
    .admin-table th { color: #FACC15; padding: 0.85rem 1.25rem; font-size: .8rem; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Oswald', sans-serif; }
    .admin-table td { padding: 0.85rem 1.25rem; border-bottom: 1px solid #161616; color: #ccc; vertical-align: middle; }
    
    .badge-estado { padding: .25rem .5rem; border-radius: 4px; font-weight: bold; font-size: 0.75rem; text-transform: uppercase; border: 1px solid; }
    .estado-ingresada { background: rgba(250,204,21,0.1); color: #FACC15; border-color: rgba(250,204,21,0.3); }
    .estado-service { background: rgba(59,130,246,0.1); color: #3b82f6; border-color: rgba(59,130,246,0.3); }
    .estado-terminado { background: rgba(74,222,128,0.1); color: #4ade80; border-color: rgba(74,222,128,0.3); }
    .estado-entregado { background: rgba(156,163,175,0.1); color: #9ca3af; border-color: rgba(156,163,175,0.3); }
    
    .btn { font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; border: none; padding: .5rem 1rem; border-radius: 6px; cursor: pointer; transition: all .15s ease; font-size: .8rem; }
    .btn-primary { background: #FACC15; color: #000; }
    .btn-primary:hover { background: #EAB308; }
    .btn-cancel { background: #1a1a1a; color: #ccc; border: 1px solid #2a2a2a; }
    .btn-whatsapp { background: #25D366; color: #fff; }
    .btn-whatsapp:hover { background: #20ba5a; }
    .btn-reenviar { background: transparent; color: #facc15; border: 1px solid #facc15; padding: 0.3rem 0.6rem; font-size: 0.75rem; }
    .btn-add-item { background: #1c1917; color: #FACC15; border: 1px dashed #78716c; padding: 0.35rem 0.75rem; font-size: 0.8rem; margin-top: 0.5rem; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
    .modal-content { background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 2rem; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: .3rem; }
    .form-group label { font-size: .75rem; font-weight: 600; color: #FACC15; text-transform: uppercase; }
    .form-control { background: #141414; border: 1px solid #262626; border-radius: 6px; color: #e5e5e5; padding: .6rem .8rem; width: 100%; }
    
    .pin-box { background: #141414; border: 1px solid #333; border-radius: 6px; padding: 0.3rem 0.5rem; color: #fff; width: 85px; text-align: center; font-weight: bold; font-family: monospace; }
    .item-row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
    .alert-error { padding: 1rem; border-radius: 8px; font-size: 0.9rem; background: rgba(239,68,68,0.1); border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .empty { text-align: center; padding: 3rem 1rem; color: #666; }
  `],
  template: `
    <div class="admin-container">
      <div class="top-row">
        <div class="title-section">
          <h2>Órdenes de <span>Servicio</span></h2>
          <span style="color: #666; font-size: 0.85rem; text-transform: uppercase;">Módulo de Recepción, Flujo de PIN y Entregas</span>
        </div>
        <button class="btn btn-primary" (click)="abrirCrear()">+ Generar Orden</button>
      </div>

      <div class="alert-error" *ngIf="errorMensaje && !mostrarModal">⚠️ {{ errorMensaje }}</div>

      <div class="table-wrapper">
        <table class="admin-table" *ngIf="ordenes().length > 0">
          <thead>
            <tr>
              <th style="width: 5%">Nro</th>
              <th style="width: 15%">Moto (Patente)</th>
              <th style="width: 15%">Mecánico Asignado</th>
              <th style="width: 13%">Estado</th>
              <th style="width: 12%">PIN Retiro</th>
              <th style="width: 40%; text-align: right;">Acciones de Entrega y WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let o of ordenes()">
              <td><strong>#{{ o.id }}</strong></td>
              <td style="color: #fff; font-weight: 600;">{{ o.patenteMoto || o.idMoto }}</td>
              
              <td style="color: #e5e5e5;">{{ obtenerNombreMecanico(o.idMecanico || o.mecanicoId) }}</td>
              
              <td>
                <span class="badge-estado" [ngClass]="{
                  'estado-ingresada': o.estado === 'MOTO_INGRESADA',
                  'estado-service': o.estado === 'REALIZANDOSE_SERVICE',
                  'estado-terminado': o.estado === 'SERVICE_TERMINADO',
                  'estado-entregado': o.estado === 'ENTREGADO'
                }">{{ o.estado }}</span>
              </td>

              <td>
                <div *ngIf="o.estado === 'SERVICE_TERMINADO' && o.pin">
                  <span style="color: #4ade80; font-weight: bold; font-family: monospace; font-size: 1.1rem;">{{ o.pin }}</span>
                  <div style="font-size: 0.65rem; color: #888;">Exp: {{ o.fechaExpiracionPin | date:'HH:mm' }}</div>
                </div>
                <span *ngIf="o.estado !== 'SERVICE_TERMINADO' || !o.pin" style="color: #444;">-</span>
              </td>

              <td style="text-align: right;">
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                  
                  <button *ngIf="o.estado === 'SERVICE_TERMINADO' && o.whatsappUrl" 
                          class="btn btn-whatsapp" (click)="enviarNotificacionPin(o)">
                    💬 WhatsApp
                  </button>

                  <button *ngIf="o.estado === 'SERVICE_TERMINADO'" 
                          class="btn btn-reenviar" (click)="regenerarPin(o.id)">
                    🔄 Nuevo PIN
                  </button>

                  <div *ngIf="o.estado === 'SERVICE_TERMINADO'" style="display: flex; gap: 0.3rem; align-items: center;">
                    <input type="text" class="pin-box" placeholder="6 Dígitos" [(ngModel)]="pinsIngresados[o.id]" maxlength="6">
                    <button class="btn btn-primary" style="padding: 0.4rem 0.8rem;" (click)="confirmarEntrega(o.id)">
                      Entregar
                    </button>
                  </div>

                  <span *ngIf="o.estado === 'ENTREGADO'" style="color: #888; font-size: 0.85rem; font-style: italic;">
                    Moto entregada correctamente 🔑
                  </span>
                  <span *ngIf="o.estado === 'MOTO_INGRESADA' || o.estado === 'REALIZANDOSE_SERVICE'" style="color: #666; font-size: 0.85rem;">
                    En reparación en taller 🛠️
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty" *ngIf="ordenes().length === 0">No hay órdenes registradas.</div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="mostrarModal">
      <div class="modal-content">
        <h3 style="margin-top:0; font-size:1.4rem; color:white; font-family:'Oswald', sans-serif; text-transform:uppercase;">
          Ingresar Nueva <span style="color:#FACC15;">Orden de Taller</span>
        </h3>
        <hr style="border-color:#1f1f1f; margin-bottom:1rem;">
        
        <div class="alert-error" *ngIf="errorMensaje">⚠️ {{ errorMensaje }}</div>

        <form (ngSubmit)="guardar()">
          <div class="grid-2">
            <div class="form-group">
              <label>Seleccionar Motocicleta</label>
              <select class="form-control" [(ngModel)]="form.idMoto" name="idMoto">
                <option [value]="null" disabled selected>Elija una moto...</option>
                <option *ngFor="let m of motos" [value]="m.id">{{ m.patente | uppercase }} - {{ m.marca?.nombre || m.marca }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Celular de Contacto (10 números)</label>
              <input type="text" class="form-control" [(ngModel)]="form.telefonoContacto" name="telefonoContacto" placeholder="Ej: 3704123456" maxlength="10">
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label>Asignar Mecánico Responsable</label>
              <select class="form-control" [(ngModel)]="form.idMecanico" name="idMecanico">
                <option [value]="null" disabled selected>Seleccione un mecánico...</option>
                <option *ngFor="let mec of listaMecanicos" [value]="mec.id">{{ mec.nombre || mec.username }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Método de Pago Tentativo</label>
              <select class="form-control" [(ngModel)]="form.idMetodoPago" name="idMetodoPago">
                <option [value]="1">Efectivo / Débito</option>
                <option [value]="2">Transferencia Bancaria</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Notas de Recepción / Síntomas</label>
            <textarea class="form-control" rows="2" [(ngModel)]="form.notas" name="notas" placeholder="Ej: Cambiar transmisión y revisar ruidos..."></textarea>
          </div>

          <div class="form-group" style="border-top: 1px solid #1f1f1f; padding-top: 0.75rem;">
            <label>Servicios Iniciales Solicitados</label>
            <div class="item-row" *ngFor="let s of form.servicios; let i = index">
              <select class="form-control" [(ngModel)]="s.idServicio" name="serv-{{i}}">
                <option [value]="0" disabled selected>Seleccione servicio...</option>
                <option *ngFor="let serv of listaServicios" [value]="serv.id">{{ serv.nombre }}</option>
              </select>
              <button type="button" class="btn btn-cancel" style="padding: 0.5rem;" (click)="removerServicio(i)">❌</button>
            </div>
            <button type="button" class="btn btn-add-item" (click)="agregarServicio()">+ Añadir Servicio</button>
          </div>

          <div class="form-group" style="border-top: 1px solid #1f1f1f; padding-top: 0.75rem; margin-bottom: 1.5rem;">
            <label>Productos / Repuestos a Reservar</label>
            <div class="item-row" *ngFor="let p of form.productos; let i = index">
              <select class="form-control" [(ngModel)]="p.idProducto" name="prod-{{i}}" style="flex: 2;">
                <option [value]="0" disabled selected>Seleccione producto...</option>
                <option *ngFor="let prod of listaProductos" [value]="prod.id">{{ prod.nombre }}</option>
              </select>
              <input type="number" class="form-control" [(ngModel)]="p.cantidad" name="cant-{{i}}" style="flex: 1;" placeholder="Cant" min="1">
              <button type="button" class="btn btn-cancel" style="padding: 0.5rem;" (click)="removerProducto(i)">❌</button>
            </div>
            <button type="button" class="btn btn-add-item" (click)="agregarProducto()">+ Añadir Repuesto</button>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:.5rem;">
            <button type="button" class="btn btn-cancel" (click)="cerrarModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Registrar e Iniciar Orden</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminOrdenesComponent implements OnInit {
  ordenes = signal<any[]>([]);
  motos: any[] = [];
  listaMecanicos: any[] = [];
  listaServicios: any[] = [];
  listaProductos: any[] = [];
  pinsIngresados: { [key: number]: string } = {};

  mostrarModal = false;
  errorMensaje = '';

  form = { idMoto: null as number | null, telefonoContacto: '', estado: 'MOTO_INGRESADA', notas: '', idMecanico: null as number | null, idUsuario: 1, idMetodoPago: 1, servicios: [] as any[], productos: [] as any[] };

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:8080/api/ordenes';

  private getHeaders() { return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.obtenerToken()}` }); }

  ngOnInit() {
    this.cargarOrdenesGenerales();
    this.cargarListasDeApoyo();
    this.cargarMecanicosRobusto();
  }

  // 🌟 NUEVA FUNCIÓN: Busca el ID del mecánico y te devuelve su nombre real
  obtenerNombreMecanico(idMecanico: number): string {
    if (!idMecanico) return 'Sin asignar';
    const mecanico = this.listaMecanicos.find(m => m.id === Number(idMecanico));
    return mecanico ? (mecanico.nombre || mecanico.username) : `Mecánico #${idMecanico}`;
  }

cargarOrdenesGenerales() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (data) => { 
        this.ordenes.set(data); 

        const mapaMecanicos = new Map();

        // 🌟 EXTRACCIÓN 100% REAL: Solo procesamos lo que viene del servidor
        if (data && data.length > 0) {
          data.forEach(o => {
            const idMec = o.idMecanico || o.mecanicoId || (o.mecanico && o.mecanico.id);
            const nombreMec = o.nombreMecanico || (o.mecanico && (o.mecanico.nombre || o.mecanico.username || o.mecanico.nombreUsuario));

            if (idMec && nombreMec) {
              mapaMecanicos.set(Number(idMec), { id: Number(idMec), nombre: nombreMec });
            }
          });
        }

        // Pasamos al select ÚNICAMENTE los mecánicos verdaderos detectados
        this.listaMecanicos = Array.from(mapaMecanicos.values());
        
        // 🚨 SI LA LISTA QUEDA VACÍA: Significa que no hay órdenes creadas con mecánicos cargados en el DTO
        if (this.listaMecanicos.length === 0) {
          console.warn("Alerta: El backend no devolvió mecánicos embebidos en las órdenes.");
        }

        this.cdr.detectChanges(); 
      },
      error: () => {
        this.errorMensaje = 'Error al recuperar listado contable de órdenes.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarMecanicosRobusto() {
    // Ya no dependemos de que este endpoint falle o no exista,
    // porque la lógica segura se ejecuta arriba en "cargarOrdenesGenerales()"
    this.http.get<any[]>('http://localhost:8080/api/usuarios', { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        if (res && res.length > 0) this.filtrarYAsignarMecanicos(res);
      },
      error: () => this.cdr.detectChanges()
    });
  }

  filtrarYAsignarMecanicos(usuarios: any[]) {
    if (!usuarios || !Array.isArray(usuarios)) return;
    this.listaMecanicos = usuarios.filter(u => 
      u.rol === 'MECANICO' || u.role === 'MECANICO' ||
      u.roles?.some((r: any) => String(r.nombre || r).toUpperCase().includes('MECANICO'))
    );
    if (this.listaMecanicos.length === 0) this.listaMecanicos = usuarios;
    this.cdr.detectChanges();
  }

  cargarListasDeApoyo() {
    this.http.get<any[]>('http://localhost:8080/api/motocicletas', { headers: this.getHeaders() }).subscribe(d => this.motos = d);
    this.http.get<any[]>('http://localhost:8080/api/servicios', { headers: this.getHeaders() }).subscribe(d => this.listaServicios = d);
    this.http.get<any[]>('http://localhost:8080/api/productos', { headers: this.getHeaders() }).subscribe(d => this.listaProductos = d);
  }

  enviarNotificacionPin(orden: any) {
    if (orden.whatsappUrl) window.open(orden.whatsappUrl, '_blank');
  }

  regenerarPin(ordenId: number) {
    this.http.post(`${this.apiUrl}/${ordenId}/reenviar-pin`, null, { headers: this.getHeaders() }).subscribe({
      next: () => { alert("¡PIN modificado y extendido por 15 minutos!"); this.cargarOrdenesGenerales(); },
      error: (err) => alert(err.error?.message || "No se pudo regenerar.")
    });
  }

  confirmarEntrega(ordenId: number) {
    const pin = this.pinsIngresados[ordenId];
    if (!pin || pin.trim().length !== 6) { alert("Ingrese el PIN de 6 dígitos."); return; }

    const urlConParams = `${this.apiUrl}/${ordenId}/estado?estado=ENTREGADO&pin=${pin.trim()}`;
    this.http.patch(urlConParams, null, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert("¡Entrega aprobada exitosamente! 🔑");
        this.pinsIngresados[ordenId] = '';
        this.cargarOrdenesGenerales();
      },
      error: (err) => alert(err.error?.message || "PIN incorrecto o expirado.")
    });
  }

  abrirCrear() {
    this.errorMensaje = '';
    this.form = { idMoto: null, telefonoContacto: '', estado: 'MOTO_INGRESADA', notas: '', idMecanico: null, idUsuario: 1, idMetodoPago: 1, servicios: [], productos: [] };
    this.mostrarModal = true;
  }
  cerrarModal() { this.mostrarModal = false; }
  agregarServicio() { this.form.servicios.push({ idServicio: 0 }); }
  removerServicio(index: number) { this.form.servicios.splice(index, 1); }
  agregarProducto() { this.form.productos.push({ idProducto: 0, cantidad: 1 }); }
  removerProducto(index: number) { this.form.productos.splice(index, 1); }

  guardar() {
    this.errorMensaje = '';
    if (!this.form.idMoto || !this.form.telefonoContacto.trim() || !this.form.idMecanico) {
      this.errorMensaje = 'Por favor complete los campos obligatorios.'; return;
    }
    const celularLimpio = this.form.telefonoContacto.trim();
    if (!/^[0-9]{10}$/.test(celularLimpio)) { this.errorMensaje = 'El celular debe tener 10 números.'; return; }

    const payload = {
      ...this.form, telefonoContacto: celularLimpio,
      idMoto: Number(this.form.idMoto), idMecanico: Number(this.form.idMecanico),
      servicios: this.form.servicios.filter(s => s.idServicio > 0),
      productos: this.form.productos.filter(p => p.idProducto > 0 && p.cantidad > 0)
    };

    this.http.post(this.apiUrl, payload, { headers: this.getHeaders() }).subscribe({
      next: () => { this.cargarOrdenesGenerales(); this.cerrarModal(); },
      error: (err) => this.errorMensaje = err.error?.mensaje || 'Error al guardar.'
    });
  }
}