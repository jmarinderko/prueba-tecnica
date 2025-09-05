import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Product } from "../models/product.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  newProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }
}
