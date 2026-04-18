

import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart-service';
import { WishlistService } from '../../core/services/wishlist-service';
import { catchError, concatMap, forkJoin, from, Observable, of, tap, toArray } from 'rxjs';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly plat_id = inject(PLATFORM_ID);
  isLoading = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
      ],
    ],
  });

  submitForm() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (isPlatformBrowser(this.plat_id)) {
            localStorage.setItem('userToken', res.token);
            this.authService.isUserLoggedIn.set(true);

            this.syncLocalDataWithServer().subscribe({
              next: () => console.log('Syncing items...'),
              error: (err) => {
                console.error('Sync failed, moving to home:', err);
                this.isLoading.set(false);
                this.router.navigate(['/']);
              },
              complete: () => {
                console.log('Sync Completed! Waiting for data stability...');

                setTimeout(() => {
                  forkJoin({
                    cart: this.cartService.getCartData().pipe(catchError(err => of({ numOfCartItems: 0 }))),
                    wishlist: this.wishlistService.getWishlistData().pipe(catchError(err => of({ count: 0 })))
                  }).subscribe({
                    next: (response: any) => {
                      console.log('All data updated from server');

                      if (response.cart) {
                        this.cartService.totalCartItems.set(response.cart.numOfCartItems || 0);
                      }
                      if (response.wishlist) {
                        this.wishlistService.totalWishlistItems.set(response.wishlist.count || 0);
                      }
                      
                      this.isLoading.set(false);
                      this.router.navigate(['/']);
                    },
                    error: (err) => {
                      console.error('Final data fetch failed:', err);
                      this.isLoading.set(false);
                      this.router.navigate(['/']);
                    }
                  });
                }, 100);
              }
            });
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  private syncLocalDataWithServer(): Observable<any> {
    const requests: Observable<any>[] = [];
    
    if (isPlatformBrowser(this.plat_id)) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      
      localCart.forEach((product: any) => {
        const pId = product._id || product.id;
        if (pId) {
          requests.push(
            this.cartService.addToCart(pId).pipe(
              catchError(err => {
                console.error(`Error syncing product ${pId}:`, err);
                return of(null);
              })
            )
          );
        }
      });
    }

    if (requests.length === 0) return of(null);

    return forkJoin(requests).pipe(
      tap(() => {
        if (isPlatformBrowser(this.plat_id)) {
          localStorage.removeItem('localCart');
          localStorage.removeItem('localWishlist'); 
          console.log('Local storage cleared.');
        }
      })
    );
  }
}