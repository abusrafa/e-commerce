import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { specificBrand } from '../models/specificBrand';



@Injectable({
  providedIn: 'root',
})
export class AllBrands {
     myHttp = inject(HttpClient)
  baseUrl = environment.basUrl

  getAllBrands(): Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/brands`)
  }
  
  getSpecificBrand(id:string): Observable<any>{
    return this.myHttp.get<specificBrand>(`${this.baseUrl}/brands/${id}`)
  }
}
