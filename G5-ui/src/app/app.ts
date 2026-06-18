import { Component } from '@angular/core';
import { HeaderComponent } from './core/header/header';
import { SidebarComponent } from './core/sidebar/sidebar';
import { ProductListComponent } from './components/product-list/product-list';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    HeaderComponent,
    SidebarComponent,
    ProductListComponent
  ],

  template: `

    <div class="min-h-screen flex flex-col bg-gray-100">

      <app-header></app-header>

      <div class="flex flex-1">

        <app-sidebar></app-sidebar>

        <main class="flex-1 p-6">

          <app-product-list>
          </app-product-list>

        </main>

      </div>

      <footer
        class="bg-black text-yellow-400 text-center p-4">

        MotoX Parts © 2026

      </footer>

    </div>

  `
})
export class App {}