import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-admin-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght=400;600;700&display=swap');

    * {
      box-sizing: border-box;
      font-family: 'Oswald', sans-serif;
    }

    .admin-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1.5rem;
    }

    .header-container {
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #1f1f1f;
      padding-bottom: 1rem;
    }

    .title {
      font-size: 1.6rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      margin: 0 0 1rem 0;
    }
    .title span { color: #FACC15; }

    /* 🌟 BARRA DE FILTROS ESTILIZADA */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      background: #0a0a0a;
      padding: 1rem;
      border: 1px solid #1f1f1f;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      align-items: center;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
      min-width: 200px;
    }

    .filter-group label {
      font-size: 0.7rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .input-filter {
      background: #141414;
      border: 1px solid #333;
      color: #fff;
      padding: 0.5rem;
      border-radius: 5px;
      font-size: 0.85rem;
      outline: none;
    }
    .input-filter:focus { border-color: #FACC15; }

    /* TABLA Y CONTENIDO */
    .table-wrapper { border: 1px solid #1f1f1f; border-radius: 10px; overflow: hidden; background: #111; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: .88rem; text-align: left; }
    .admin-table thead tr { background: #0a0a0a; border-bottom: 2px solid #FACC15; }
    .admin-table th { color: #FACC15; padding: .85rem 1.25rem; font-size: .72rem; letter-spacing: 1.5px; text-transform: uppercase; }
    .admin-table td { color: #ccc; padding: .85rem 1.25rem; border-bottom: 1px solid #161616; }
    .admin-table tr:hover { background: #161616; }
    .admin-table tr:last-child td { border-bottom: none; }

    .select-estado {
      background: #1a1a1a;
      border: 1px solid #333;
      color: #fff;
      padding: .4rem .6rem;
      border-radius: 5px;
      font-size: .8rem;
      cursor: pointer;
      outline: none;
    }
    .select-estado:focus { border-color: #FACC15; }

    /* BADGES ACTUALIZADOS */
    .badge { padding: .25rem .5rem; border-radius: 4px; font-size: .7rem; font-weight: 700; text-transform: uppercase; }
    .badge-pagada { background: rgba(74,222,128,0.15); color: #4ade80; }
    .badge-pendiente { background: rgba(250,204,21,0.15); color: #facc15; }
    .badge-cancelada { background: rgba(239,68,68,0.15); color: #f87171; }

    .alert-error { padding: .75rem; border-radius: 6px; font-size: 0.85rem; background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; color: #fc8181; margin-bottom: 1.25rem; }
    .empty-state { text-align: center; padding: 3rem 1rem; color: #555; font-size: .9rem; }
  `],
  template: `
    <div class="admin-container">

      <div class="header-container">
        <h2 class="title">Historial de <span>Facturas / Ventas</span></h2>
      </div>

      <div class="alert-error" *ngIf="errorLista">⚠️ {{ errorLista }}</div>

      <!-- 🌟 CONTROLES DE FILTRO -->
      <div class="filter-bar">
        <div class="filter-group">
          <label>Buscar por Cliente</label>
          <input type="text" class="input-filter" placeholder="Escribí el nombre..." [(ngModel)]="filtroNombre">
        </div>
        <div class="filter-group">
          <label>Filtrar por Estado</label>
          <select class="input-filter" [(ngModel)]="filtroEstado">
            <option value="TODOS">TODOS LOS ESTADOS</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PAGADA">PAGADA</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="admin-table" *ngIf="facturasFiltradas.length > 0">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Fecha</th>
              <th>Cliente</th> <!-- 🌟 Cambio: Nombre en vez de ID -->
              <th>Total Ventas</th>
              <th>Estado Actual</th>
              <th>Cambiar Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let fact of facturasFiltradas">
              <td><strong>#{{ fact.id }}</strong></td>
              <td>{{ fact.fecha | date:'dd/MM/yyyy HH:mm' }}</td>
              
              <!-- 🌟 Mostramos el nombre de forma segura (con fallback por las dudas) -->
              <td style="color: #fff; font-weight: 600;">
                {{ fact.usuario?.nombre || fact.nombreUsuario || 'Cliente General' }}
              </td>

              <td style="color: #FACC15; font-weight: 700;">\${{ fact.total | number:'1.2-2' }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-pagada': fact.estado === 'PAGADA',
                  'badge-pendiente': fact.estado === 'PENDIENTE',
                  'badge-cancelada': fact.estado === 'CANCELADA'
                }">
                  {{ fact.estado }}
                </span>
              </td>
              <td>
                <!-- 🌟 Opciones corregidas sin ENTREGADA e incluyendo PENDIENTE -->
                <select class="select-estado" [ngModel]="fact.estado" (ngModelChange)="cambiarEstado(fact.id, $event)">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="PAGADA">PAGADA</option>
                  <option value="CANCELADA">CANCELADA</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="facturasFiltradas.length === 0" class="empty-state">
          No se encontraron facturas que coincidan con los filtros aplicados.
        </div>
      </div>
    </div>
  `
})
export class AdminFacturasComponent implements OnInit {
  facturas: any[] = [];
  errorLista = '';

  // Propiedades para los filtros reactivos
  filtroNombre = '';
  filtroEstado = 'TODOS';

  private facturaService = inject(FacturaService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cargarFacturas();
  }

  // 🌟 Filtro calculado en tiempo real
  get facturasFiltradas(): any[] {
    return this.facturas.filter(fact => {
      // 1. Resolvemos el nombre del usuario dependiento de cómo venga estructurado del backend
      const nombreCliente = (fact.usuario?.nombre || fact.nombreUsuario || '').toLowerCase();
      const cumpleNombre = nombreCliente.includes(this.filtroNombre.toLowerCase());

      // 2. Filtramos por estado
      const cumpleEstado = this.filtroEstado === 'TODOS' || fact.estado === this.filtroEstado;

      return cumpleNombre && cumpleEstado;
    });
  }

  cargarFacturas() {
    this.errorLista = '';
    this.facturaService.listarTodas().subscribe({
      next: (res: any[]) => {
        this.facturas = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorLista = 'No se pudieron recuperar las facturas del servidor.';
        console.error(err);
      }
    });
  }

  cambiarEstado(idFactura: number, nuevoEstado: string) {
    this.facturaService.actualizarEstado(idFactura, nuevoEstado).subscribe({
      next: () => {
        alert(`Factura #${idFactura} actualizada a ${nuevoEstado} con éxito.`);
        this.cargarFacturas();
      },
      error: (err: any) => {
        alert('No se pudo actualizar el estado de la factura.');
        console.error(err);
      }
    });
  }
}