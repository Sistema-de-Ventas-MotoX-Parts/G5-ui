import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api/productos';
  private imgUrl = 'http://localhost:8080/api/imagenes/upload'; // 🌟 Tu endpoint de Cloudinary

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private getHeaders(esFormData: boolean = false) {
    if (isPlatformBrowser(this.platformId)) {
      const sesion = localStorage.getItem('sesion');
      if (!sesion) return new HttpHeaders();

      const usuario = JSON.parse(sesion);
      let headersMap: { [header: string]: string } = {
        'Authorization': `Bearer ${usuario.token}`
      };

      if (!esFormData) {
        headersMap['Content-Type'] = 'application/json';
      }
      return new HttpHeaders(headersMap);
    }
    return new HttpHeaders();
  }

  // 🌟 NUEVO: Sube la imagen a Cloudinary y devuelve la URL remota
  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file); // 🌟 Tu backend espera el parámetro llamado "file"
    return this.http.post<{ url: string }>(this.imgUrl, formData, {
      headers: this.getHeaders(true) // true para que NO fuerce el JSON y use Multipart
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl, { headers: this.getHeaders(false) });
  }

  // 🌟 Volvemos a pedir un 'Product' de tipo JSON común
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { headers: this.getHeaders(false) });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders(false) });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders(false) });
  }
}
