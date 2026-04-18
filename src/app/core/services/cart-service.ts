import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Token } from '@angular/compiler';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  myHttp = inject(HttpClient)
  baseUrl: string = environment.basUrl
  token: string = ""
  id = inject(PLATFORM_ID)
  totalCartItems = signal(0)
  

  constructor() { 
    if (isPlatformBrowser(this.id)) {
      this.token = localStorage.getItem('userToken') as string
    }
  }
  
  getCartData(): Observable<any>{
    return this.myHttp.get(`${this.baseUrl}/cart`, {
      headers: {
    token: this.token
      }
    })
  }


    addToCart(productId: string): Observable<any>{
      return this.myHttp.post(`${this.baseUrl}/cart`,{
        "productId": productId
      },
        {
      headers: {
    token: this.token
      }
    })
  }

      updateProductQuantity(productId: string,count:number): Observable<any>{
      return this.myHttp.put(`${this.baseUrl}/cart/${productId}`,{
        "count": count
      },
        {
      headers: {
    token: this.token
      }
    })
      }
  
       removeSpecificCartItem(productId: string): Observable<any>{
      return this.myHttp.delete(`${this.baseUrl}/cart/${productId}`,
        {
      headers: {
    token: this.token
      }
    })
      }
  
        removeCartItems(): Observable<any>{
      return this.myHttp.delete(`${this.baseUrl}/cart`,
        {
      headers: {
    token: this.token
      }
    })
      }
  

      
      cashPayment(cartId: string,data:object): Observable<any>{
          return this.myHttp.post(`${this.baseUrl}/orders/${cartId} `,data,
        {
      headers: {
    token: this.token
      }
            })
      }
  
      visaPayment(cartId: string,data:object): Observable<any>{
      return this.myHttp.post(`${this.baseUrl}/orders/checkout-session/${cartId}?url=${environment.url} `,data,
        {
      headers: {
      token: this.token
      }
      })
      }
  
      getOrders(userId:string): Observable<any>{
      return this.myHttp.get(`${this.baseUrl}/orders/user/${userId} `,
        {
      headers: {
      token: this.token
      }
      })
      }
  
}
