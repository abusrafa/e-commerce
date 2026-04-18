import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  myHttp = inject(HttpClient)
  baseUrl = environment.basUrl
  
  getAllProducts(pageNumber=1 , limit=100) : Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/products?limit=${limit}&page=${pageNumber}`)
  }

  getSpecificProduct(id:string) : Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/products/${id}`)
  }


  getCategoryProducts(id:string) : Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/products?category=${id}`)
  }

   getSubcategoriesProducts(id:string) : Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/products?subcategory=${id}`)
  }

  getBrandProducts(id:string) : Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/products?brand=${id}`)
  }

}
