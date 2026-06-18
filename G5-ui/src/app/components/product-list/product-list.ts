import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/products';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="bg-white p-6 rounded-lg shadow">

      <h2 class="text-2xl font-bold mb-6">
        Gestión de Productos
      </h2>

      <div class="grid grid-cols-3 gap-4 mb-6">

        <input
          type="text"
          placeholder="Nombre"
          [(ngModel)]="nombre"
          class="border p-2 rounded"
        >

        <input
          type="number"
          placeholder="Precio"
          [(ngModel)]="precio"
          class="border p-2 rounded"
        >

        <input
          type="number"
          placeholder="Stock"
          [(ngModel)]="stock"
          class="border p-2 rounded"
        >

      </div>

      <button
        (click)="agregarProducto()"
        class="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded font-semibold"
      >
        Agregar Producto
      </button>

      <table class="w-full mt-8 border">

        <thead class="bg-black text-yellow-400">

          <tr>
            <th class="p-3 text-left">Nombre</th>
            <th class="p-3 text-left">Precio</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-left">Acciones</th>
          </tr>

        </thead>

        <tbody>

          <tr
            *ngFor="let p of products"
            class="border-b"
          >

            <td class="p-3">
              {{ p.nombre }}
            </td>

            <td class="p-3">
              $ {{ p.precio }}
            </td>

            <td class="p-3">
              {{ p.stock }}
            </td>

            <td class="p-3">

              <button
                (click)="eliminarProducto(p.id)"
                class="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>

            </td>

          </tr>

        </tbody>

      </table>

    </div>
  `
})
export class ProductListComponent {

  nombre = '';
  precio = 0;
  stock = 0;

  products: Product[] = [
    {
      id: 1,
      nombre: 'Casco Integral',
      precio: 150000,
      stock: 10
    }
  ];

  agregarProducto() {

    if (
      !this.nombre ||
      this.precio <= 0 ||
      this.stock < 0
    ) {
      return;
    }

    this.products.push({
      id: Date.now(),
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock
    });

    this.nombre = '';
    this.precio = 0;
    this.stock = 0;
  }

  eliminarProducto(id: number) {
    this.products = this.products.filter(
      p => p.id !== id
    );
  }
}