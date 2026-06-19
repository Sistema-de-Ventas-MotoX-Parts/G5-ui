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
      padding: 0 1rem 0.5rem 1rem;
      margin-bottom: 0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: .85rem;
      padding: 1.5rem 1rem .85rem 1rem;
    }
    .brand-logo {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #444;
      background: #111;
    }
    .brand-title {
      color: #fff;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: .2px;
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
    .nav-item.active .nav-icon { opacity: 1; }

    .nav-icon {
      font-size: 1rem;
      opacity: .6;
      flex-shrink: 0;
    }
    .nav-item.active .nav-icon { opacity: 1; }

    .divider {
      height: 1px;
      background: #1f1f1f;
      margin: .75rem 0;
    }
  `],

  template: `
    <aside>
      <div class="brand">

      </div>

      <span class="nav-label">Menú</span>
      <div
        class="nav-item"
        [class.active]="activo === 'inicio'"
        (click)="cambiar('inicio')">
        <span class="nav-icon"></span> Inicio
      </div>

      <div class="divider"></div>

      <div
        class="nav-item"
        [class.active]="activo === 'productos'"
        (click)="cambiar('productos')">
        <span class="nav-icon"></span> Productos
      </div>

      <div
        class="nav-item"
        [class.active]="activo === 'categorias'"
        (click)="cambiar('categorias')">
        <span class="nav-icon"></span> Categorías
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