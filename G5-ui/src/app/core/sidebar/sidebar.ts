import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    aside {
      width: 220px;
      background: #000;
      border-right: 1px solid #222;
      height: 100vh;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
      position: sticky;
      top: 0;
    }

    .nav-label {
      font-size: .65rem;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #444;
      padding: 1.5rem 1rem 0.5rem 1rem;
      margin-bottom: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: .85rem;
      padding: 1.5rem 1rem .85rem 1rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: .65rem;
      padding: .65rem .75rem;
      border-radius: 7px;
      cursor: pointer;
      font-size: .875rem;
      font-weight: 500;
      color: #888;
      transition: background .15s, color .15s;
      user-select: none;
      margin: 0 0.5rem;
    }
    .nav-item:hover {
      background: #141313;
      color: #fff;
    }
    .nav-item.active {
      background: #FACC15;
      color: #000;
      font-weight: 700;
    }

    .nav-icon {
      font-size: 1rem;
      opacity: .6;
      flex-shrink: 0;
    }
    .nav-item.active .nav-icon { opacity: 1; }
  `],
  template: `
    <aside>
      <div class="brand"></div>

      <span class="nav-label">Menú Admin</span>

      <div class="nav-item" [class.active]="activo === 'inicio'" (click)="cambiar('inicio')">
        <span class="nav-icon"></span> Inicio
      </div>

      <div class="nav-item" [class.active]="activo === 'productos'" (click)="cambiar('productos')">
        <span class="nav-icon"></span> Productos
      </div>

      <div class="nav-item" [class.active]="activo === 'categorias'" (click)="cambiar('categorias')">
        <span class="nav-icon"></span> Categorías
      </div>

      <div class="nav-item" [class.active]="activo === 'usuarios'" (click)="cambiar('usuarios')">
        <span class="nav-icon"></span> Usuarios
      </div>

      <div class="nav-item" [class.active]="activo === 'servicios'" (click)="cambiar('servicios')">
        <span class="nav-icon"></span> Servicios
      </div>

      <div class="nav-item" [class.active]="activo === 'facturas'" (click)="cambiar('facturas')">
        <span class="nav-icon"></span> Facturas
      </div>

      <div class="nav-item" [class.active]="activo === 'motocicletas'" (click)="cambiar('motocicletas')">
        <span class="nav-icon"></span> Motocicletas
      </div>

      <div class="nav-item" [class.active]="activo === 'marcas'" (click)="cambiar('marcas')">
        <span class="nav-icon"></span> Marcas
      </div>

      <div class="nav-item" [class.active]="activo === 'modelos'" (click)="cambiar('modelos')">
        <span class="nav-icon"></span> Modelos
      </div>

      <div class="nav-item" [class.active]="activo === 'ordenes'" (click)="cambiar('ordenes')">
        <span class="nav-icon"></span> Órdenes
      </div>

      <span class="nav-label">Cuenta</span>
      <div class="nav-item" [class.active]="activo === 'mi-perfil'" (click)="cambiar('mi-perfil')">
        <span class="nav-icon"></span> Mi Perfil
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Output() menu = new EventEmitter<string>();
  activo = 'inicio';

  cambiar(valor: string) {
    this.activo = valor;
    this.menu.emit(valor); 
  }
}