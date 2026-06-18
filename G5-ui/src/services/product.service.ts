import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [
    {
      id: 1,
      nombre: 'Casco Integral',
      precio: 150000,
      stock: 10
    }
  ];

  getProducts() {
    return this.products;
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(
      p => p.id !== id
    );
  }
}