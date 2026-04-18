import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist-service';
import { AuthService } from '../../core/auth/services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { WishListInterface } from '../../core/models/wish-list-interface';
import { CartService } from '../../core/services/cart-service';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, DecimalPipe, LoadingComponent],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly toaster = inject(ToastrService);
  private readonly platId = inject(PLATFORM_ID);
  
  totalWishCount = signal(0);
  wishListData = signal<WishListInterface>({ data: [], count: 0, status: '' } as WishListInterface);
  isLoading = signal<boolean>(false);
  isLoggedIn = signal<boolean>(this.checkInitialStatus());

  private checkInitialStatus(): boolean {
    if (isPlatformBrowser(this.platId)) {
      return !!localStorage.getItem('userToken');
    }
    return false;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }

  ngOnInit(): void {
    this.getCartIdsData();
    this.getWishlistData();
  }

  getWishlistData() {
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.wishlistService.getWishlistData().subscribe({
        next: (res) => {
          this.wishListData.set(res);
          const count = res.count || res.data?.length || 0;
          this.wishlistService.totalWishlistItems.set(count);
          this.totalWishCount.set(count);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching wishlist:', err);
          this.isLoading.set(false);
        },
      });
    } else if (isPlatformBrowser(this.platId)) {
      const localData = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      this.wishListData.set({
        status: 'success',
        count: localData.length,
        data: localData
      } as WishListInterface);

      this.totalWishCount.set(localData.length);
      this.wishlistService.totalWishlistItems.set(localData.length);
    }
  }

  cartIds = computed(() => {
    if (this.authService.isUserLoggedIn()) {
      const products = this.cartDetailsIds()?.data?.products || [];
      return products.map((item: any) => item.product._id || item.product.id);
    } else {
      this.cartDetailsIds();
      if (isPlatformBrowser(this.platId)) {
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        return localCart.map((item: any) => item._id || item.id);
      }
      return [];
    }
  });

  isInCart(productId: string): boolean {
    return this.cartIds().includes(productId);
  }

  cartDetailsIds = signal<any>({ data: { products: [] } });

  getCartIdsData() {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        this.cartDetailsIds.set(res);
      }
    });
  }

  addToCart(product: any) {
    const pId = product._id || product.id;
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.cartService.addToCart(pId).subscribe({
        next: (res) => {
          this.toaster.success("Product added to your cart", "FreshCart");
          this.cartService.totalCartItems.update((val) => val + 1);
          this.getCartIdsData();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toaster.error("Failed to add product", "FreshCart");
          this.isLoading.set(false);
        }
      });
    } else {
      if (isPlatformBrowser(this.platId)) {
        let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const isExist = localCart.some((item: any) => (item._id || item.id) === pId);
        if (!isExist) {
          localCart.push(product);
          localStorage.setItem('localCart', JSON.stringify(localCart));
          this.toaster.info("Added to Local Cart", "FreshCart");
          this.cartService.totalCartItems.update((val) => val + 1);
          this.cartDetailsIds.update(current => ({ ...current }));
        } else {
          this.toaster.warning("Product already in cart", "FreshCart");
        }
      }
    }
  }

  removeItemFromWishlist(id: string) {
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.wishlistService.removeItemFromWishlist(id).subscribe({
        next: (res) => {
          this.toaster.success("Removed successfully");
          this.getWishlistData();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
        }
      });
    } else if (isPlatformBrowser(this.platId)) {
      let wishListData = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      wishListData = wishListData.filter((item: any) => (item._id || item.id) !== id);
      localStorage.setItem('localWishlist', JSON.stringify(wishListData));
      this.getWishlistData();
      this.toaster.success("Removed from local wishlist");
    }
  }
}