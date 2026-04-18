import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  myHttp = inject(HttpClient)
  baseUrl = environment.basUrl

 isUserLoggedIn = signal<boolean>(false);
private readonly plat_id = inject(PLATFORM_ID);

constructor() { 
  if (isPlatformBrowser(this.plat_id)) {
    if (localStorage.getItem('userToken')) {
      this.isUserLoggedIn.set(true);
    } else {
      this.isUserLoggedIn.set(false);
    }
  }
}

  
  
  register(formBody:any): Observable<any>{
    return this.myHttp.post(`${this.baseUrl}/auth/signup`, formBody)
  }

  login(formBody:any): Observable<any>{
    return this.myHttp.post(`${this.baseUrl}/auth/signin`, formBody)
  }

  forgetPassword(formBody:any): Observable<any>{
    return this.myHttp.post(`${this.baseUrl}/auth/forgotPasswords`, formBody)
  }

    verifyResetCode(formBody:any): Observable<any>{
    return this.myHttp.post(`${this.baseUrl}/auth/verifyResetCode`, formBody)
    }
  
   resetPassword(formBody:any): Observable<any>{
    return this.myHttp.put(`${this.baseUrl}/auth/resetPassword`, formBody)
  }

  
}
