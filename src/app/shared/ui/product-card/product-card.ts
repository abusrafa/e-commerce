import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../../core/models/product-interface';
import { CartService } from '../../../core/services/cart-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/services/auth-service';
import { WishlistService } from '../../../core/services/wishlist-service';
import { LoadingComponent } from "../loading/loading";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CommonModule, LoadingComponent],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  private readonly cartService = inject(CartService)
  private readonly authService = inject(AuthService)
  private readonly wishlistService = inject(WishlistService)
  private readonly toaster = inject(ToastrService)
  private readonly platId = inject(PLATFORM_ID);

  @Input({ required: true }) product!: IProduct;
  
  isLoading = signal<boolean>(false);
  protected readonly Math = Math;

  addToCart(product: any) {
    const pId = product._id || product.id;
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.cartService.addToCart(pId).subscribe({
        next: (res) => {
          this.toaster.success("Product added to your cart", "FreshCart");
          this.cartService.totalCartItems.update((val) => val + 1);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toaster.error(err.message || "something went wrong!", "FreshCart");
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
        } else {
          this.toaster.warning("Product already in cart", "FreshCart");
        }
      }
    }
  }

  addToWishlist(product: any) {
    const pId = product._id || product.id;
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.wishlistService.addToWishlist(pId).subscribe({
        next: (res) => {
          this.toaster.success("Product added successfully to your wishlist", "FreshCart");
          this.wishlistService.totalWishlistItems.update((val) => val + 1);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toaster.error(err.message || "something went wrong!", "FreshCart");
          this.isLoading.set(false);
        }
      });
    } else {
      if (isPlatformBrowser(this.platId)) {
        let localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
        const isExist = localWishlist.some((item: any) => (item._id || item.id) === pId);
        if (!isExist) {
          localWishlist.push(product);
          localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
          this.toaster.info("Added to Local Wishlist", "FreshCart");
          this.wishlistService.totalWishlistItems.update((val) => val + 1);
        } else {
          this.toaster.warning("Product already in Wishlist", "FreshCart");
        }
      }
    }
  }

  Wishlist = computed(() => {
    if (this.authService.isUserLoggedIn()) {
      const products = this.WishlistDetailsIds()?.data?.products || [];
      return products.map((item: any) => item.product._id || item.product.id);
    } else {
      this.WishlistDetailsIds();
      if (isPlatformBrowser(this.platId)) {
        const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
        return localWishlist.map((item: any) => item._id || item.id);
      }
      return [];
    }
  });

  isInWishlist(productId: string): boolean {
    return this.Wishlist().includes(productId);
  }

  WishlistDetailsIds = signal<any>({ data: { products: [] } });

  getWishlistIdsData() {
    this.cartService.getCartData().subscribe({
      next: (res) => {
        this.WishlistDetailsIds.set(res);
      }
    });
  }

  removeItemFromWishlist(id: string) {
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.wishlistService.removeItemFromWishlist(id).subscribe({
        next: (res) => {
          this.toaster.success("Removed successfully");
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
      this.toaster.success("Removed from local wishlist");
    }
  }
}