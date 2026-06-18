import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,

  template: `
    <aside
      class="w-64 bg-gray-700 text-white p-5 min-h-screen">

      <ul class="space-y-4">

        <li class="hover:text-yellow-400 cursor-pointer">
          Inicio
        </li>

        <li class="hover:text-yellow-400 cursor-pointer">
          Productos
        </li>

        <li class="hover:text-yellow-400 cursor-pointer">
          Categorías
        </li>

      </ul>

    </aside>
  `
})
export class SidebarComponent {}