import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { specificCategory } from '../models/specificCategory';
import { GetAllSubCategoriesOnCategory } from '../models/get-all-sub-categories-on-category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesServices {
    myHttp = inject(HttpClient)
  baseUrl = environment.basUrl
  categoryId = signal('')

  getAllCategories(): Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/categories`)
  }
  
  getSpecificCategories(id:string): Observable<any>{
    return this.myHttp.get<specificCategory>(`${this.baseUrl}/categories/${id}`)
  }

    getAllSubCategoriesOnCategory(id:string): Observable<any>{
    return this.myHttp.get<GetAllSubCategoriesOnCategory>(`${this.baseUrl}/categories/${id}/subcategories`)
    }
  
    getSubcategories(id:string): Observable<any>{
    return this.myHttp.get<any>(`${this.baseUrl}/subcategories/${id}`)
  }
  
  getSub_Category(id:string): Observable<any>{
    return this.myHttp.get<any>(`${this.baseUrl}/subcategories?category=${id}`)
  }

}
