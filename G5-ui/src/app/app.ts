import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/header/header';
import { SidebarComponent } from './core/sidebar/sidebar';
import { ProductListComponent } from './components/product-list/product-list';
import { CategoryListComponent } from './components/product-list/category-list';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    ProductListComponent,
    CategoryListComponent
  ],

  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap');

    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #0d0d0d;
      font-family: 'Oswald', system-ui, sans-serif;
    }

    .layout {
      display: flex;
      flex: 1;
    }

    main {
      flex: 1;
      background: #0d0d0d;
      overflow-y: auto;
    }

    /* ── INICIO ── */
    .inicio-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 120px);
      text-align: center;
      padding: 2rem;
    }

    .inicio-icon {
      font-size: 3.5rem;
      margin-bottom: 1.25rem;
    }

    .inicio-title {
      font-size: 2.75rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 1px;
      line-height: 1.1;
      margin: 0 0 .75rem;
    }

    .inicio-title span { color: #FACC15; }

    .inicio-sub {
      font-size: 1rem;
      color: #6b7280;
      letter-spacing: .5px;
      font-weight: 400;
      margin: 0 0 2.5rem;
    }

    .inicio-cards {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .inicio-card {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      padding: 1.25rem 2rem;
      cursor: pointer;
      transition: border-color .15s, background .15s;
      display: flex;
      align-items: center;
      gap: .75rem;
      font-size: 1rem;
      font-weight: 600;
      color: #aaa;
      letter-spacing: .5px;
    }
    .inicio-card:hover {
      border-color: #FACC15;
      background: #1f1f1f;
      color: #fff;
    }
    .inicio-card .card-icon { font-size: 1.25rem; }

    /* ── FOOTER ── */
    footer {
      background: #000;
      border-top: 1px solid #1f1f1f;
      padding: .9rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .footer-brand {
      font-size: .875rem;
      font-weight: 700;
      color: #FACC15;
      letter-spacing: .5px;
    }

    .footer-copy {
      font-size: .75rem;
      color: #444;
      letter-spacing: .5px;
      font-weight: 400;
    }
  `],

  template: `

    <app-header></app-header>

    <div class="layout">

      <app-sidebar (menu)="cambiarVista($event)"></app-sidebar>

      <main>

        <!-- INICIO -->
        <div *ngIf="vistaActual === 'inicio'" class="inicio-wrapper">
          <div class="inicio-icon">⚙️</div>
          <h1 class="inicio-title">Bienvenido a <span>MotoX Parts</span></h1>
          <p class="inicio-sub">Seleccioná una sección del menú para comenzar</p>

        
        </div>

        <!-- PRODUCTOS -->
        <app-product-list *ngIf="vistaActual === 'productos'"></app-product-list>

        <!-- CATEGORÍAS -->
        <app-category-list *ngIf="vistaActual === 'categorias'"></app-category-list>

      </main>

    </div>

    <footer>
      <span class="footer-brand">⚙️ MotoX Parts</span>
      <span class="footer-copy">© 2026 — Panel de administración</span>
    </footer>

  `
})
export class App {

  vistaActual: string = 'inicio';

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }
}