import { Wishlist } from './../../wishlist/wishlist';
import { CartService } from './../../../core/services/cart-service';
import { AuthService } from './../../../core/auth/services/auth-service';
import { Component, computed, HostListener, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { WishlistService } from '../../../core/services/wishlist-service';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);
  private readonly plat_id = inject(PLATFORM_ID);

  isLoggedIn = computed(() => this.authService.isUserLoggedIn());
  cartCount = computed(() => this.cartService.totalCartItems());
  wishlistCount = computed(() => this.wishlistService.totalWishlistItems());
  
  isTopBarVisible = true;
  isMenuOpen = signal(false);


goToSearch(term: string): void {
  if (term.trim()) {
    this.router.navigate(['/search'], { 
      queryParams: { q: term } 
    });
  }
}

  

  ngOnInit(): void {
    if (isPlatformBrowser(this.plat_id)) {
      initFlowbite();
    }
    this.getCartData();
  }

  getCartData() {
    if (this.authService.isUserLoggedIn()) {
      this.cartService.getCartData().subscribe({
        next: (res) => {
          const data = res.data || { products: [] };
          const count = data.products?.reduce((acc: number, item: any) => acc + item.count, 0) || 0;
          this.cartService.totalCartItems.set(count);
        },
        error: (err) => console.error('Navbar Cart Error:', err)
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.plat_id)) {
      const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
      this.isTopBarVisible = scrollOffset < 50;
    }
  }


  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  signOut() {
    if (isPlatformBrowser(this.plat_id)) {
      localStorage.removeItem('userToken');
      // localStorage.removeItem('user');
    }
    this.isMenuOpen.set(false);
    this.authService.isUserLoggedIn.set(false);
    this.cartService.totalCartItems.set(0);
    this.router.navigate(['/login']);
  }
}