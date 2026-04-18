import { AuthService } from './../../core/auth/services/auth-service';
import { CartService } from './../../core/services/cart-service';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { cart } from '../../core/models/cart';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-cart',
  imports: [RouterLink, DecimalPipe, LoadingComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly toaster = inject(ToastrService);
  private readonly platId = inject(PLATFORM_ID);
  totalCount = signal(0);
  isLoading = signal<boolean>(false);
  cartDetails = signal<any>({ products: [], totalCartPrice: 0 });

  ngOnInit(): void {
    this.getCartData();
  }

  cartProgress = computed(() => {
    const total = this.cartDetails().totalCartPrice || 0;
    const target = 500;
    const percentage = (total / target) * 100;
    return Math.min(percentage, 100);
  });

  getCartData() {
    this.totalCount.set(0);
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.cartService.getCartData().subscribe({
        next: (res) => {
          this.cartDetails.set(res.data);
          let count = 0;
          this.cartDetails().products.forEach((val: any) => (count += val.count));
          this.totalCount.set(count);
          this.cartService.totalCartItems.set(count);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        },
      });
    } else {
      if (isPlatformBrowser(this.platId)) {
        const localData = JSON.parse(localStorage.getItem('localCart') || '[]');
        const totalQuantity = localData.reduce((acc: number, item: any) => acc + (item.count || 1), 0);
        const totalPrice = localData.reduce((total: number, item: any) => {
          return total + item.price * (item.count || 1);
        }, 0);

        const formattedData = {
          products: localData.map((product: any) => ({
            count: product.count || 1,
            price: product.price,
            product: product,
          })),
          totalCartPrice: totalPrice,
        };

        this.cartDetails.set(formattedData);
        this.totalCount.set(totalQuantity);
        this.cartService.totalCartItems.set(totalQuantity);
      }
    }
  }

  ClearAllItems() {
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.totalCount.set(0);
      this.cartService.removeCartItems().subscribe({
        next: (res) => {
          this.cartService.totalCartItems.set(0);
          this.toaster.success('cart cleared successfully', 'FreshCart');
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.toaster.error(err.message || 'something went wrong!', 'FreshCart');
          this.isLoading.set(false);
        },
      });
    }
    if (isPlatformBrowser(this.platId)) {
      localStorage.removeItem('localCart');
      this.cartDetails.set({ products: [], totalCartPrice: 0 });
      this.totalCount.set(0);
      this.cartService.totalCartItems.set(0);
    }
  }

  removeProduct(productId: string) {
    if (this.authService.isUserLoggedIn()) {
      this.isLoading.set(true);
      this.totalCount.set(0);
      this.cartService.removeSpecificCartItem(productId).subscribe({
        next: (res) => {
          this.toaster.success('Product removed successfully', 'FreshCart');
          this.getCartData();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.toaster.error(err.message || 'Something went wrong!', 'FreshCart');
          this.isLoading.set(false);
        },
      });
    } else {
      if (isPlatformBrowser(this.platId)) {
        let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        localCart = localCart.filter((item: any) => (item._id || item.id) !== productId);
        localStorage.setItem('localCart', JSON.stringify(localCart));
        this.getCartData();
        this.toaster.success('Product removed from local cart', 'FreshCart');
      }
    }
  }

  updateProductQuantity(productId: string, count: number) {
    if (this.authService.isUserLoggedIn()) {
      if (count <= 0) {
        this.removeProduct(productId);
      } else {
        this.isLoading.set(true);
        this.totalCount.set(0);
        this.cartService.updateProductQuantity(productId, count).subscribe({
          next: (res) => {
            this.toaster.success('product quantity updated successfully', 'FreshCart');
            this.cartDetails.set(res.data);
            this.getCartData();
            this.cartService.totalCartItems.set(this.totalCount());
            this.isLoading.set(false);
          },
          error: (err) => {
            console.log(err);
            this.toaster.error(err.message || 'something went wrong!', 'FreshCart');
            this.isLoading.set(false);
          },
        });
      }
    } else {
      if (isPlatformBrowser(this.platId)) {
        if (count <= 0) {
          this.removeProduct(productId);
          return;
        }
        let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');

        localCart = localCart.map((item: any) => {
          if ((item._id || item.id) === productId) {
            item.count = count;
          }
          return item;
        });
        localStorage.setItem('localCart', JSON.stringify(localCart));
        this.getCartData();
        this.toaster.success('Local product quantity updated', 'FreshCart');
      }
    }
  }
}