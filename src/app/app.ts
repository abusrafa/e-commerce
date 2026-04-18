import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './core/services/flowbite-service';
import { Navbar } from './features/layouts/navbar/navbar';
import { Footer } from './features/layouts/footer/footer';
import { WishlistService } from './core/services/wishlist-service';
import { CartService } from './core/services/cart-service';
import { AuthService } from './core/auth/services/auth-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('e-commerce');
  
 constructor(private flowbiteService: FlowbiteService) {}

ngOnInit(): void {

  this.refreshCounters();

  if (isPlatformBrowser(this.platId)) {
    import('flowbite').then((flowbite) => {
      flowbite.initFlowbite();
    });
  }
}


private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private platId = inject(PLATFORM_ID);

  refreshCounters() {
    if (isPlatformBrowser(this.platId)) {
      if (this.authService.isUserLoggedIn()) {
        this.wishlistService.getWishlistData().subscribe({
          next: (res) => this.wishlistService.totalWishlistItems.set(res.count || res.data?.length)
        });
      } else {
        const localWish = JSON.parse(localStorage.getItem('localWishlist') || '[]');
        this.wishlistService.totalWishlistItems.set(localWish.length);
      }

      if (this.authService.isUserLoggedIn()) {
        this.cartService.getCartData().subscribe({
          next: (res) => this.cartService.totalCartItems.set(res.numOfCartItems)
        });
      } else {
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const totalQty = localCart.reduce((acc: number, item: any) => acc + (item.count || 1), 0);
        this.cartService.totalCartItems.set(totalQty);
      }
    }
  }














}
