import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  myHttp = inject(HttpClient)
  baseUrl: string = environment.basUrl
  token: string = ""
  id = inject(PLATFORM_ID)
  totalWishlistItems = signal(0)
  

  constructor() { 
    if (isPlatformBrowser(this.id)) {
      this.token = localStorage.getItem('userToken') as string
    
    }
  }
  
  getWishlistData(): Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/wishlist`, {
      headers: {
    token: this.token
      }
    })
  }


    addToWishlist(productId: string): Observable<any>{
      return this.myHttp.post(`${this.baseUrl}/wishlist`,{
        "productId": productId
      },
        {
      headers: {
    token: this.token
      }
    })
  }

      removeItemFromWishlist(productId: string): Observable<any>{
      return this.myHttp.delete(`${this.baseUrl}/wishlist/${productId}`,
        {
      headers: {
    token: this.token
      }
    })
      }


}
