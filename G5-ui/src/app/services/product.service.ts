import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}


  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(this.apiUrl);

  }


  createProduct(product: Product): Observable<Product> {

    return this.http.post<Product>(
      this.apiUrl,
      product
    );

  }

}