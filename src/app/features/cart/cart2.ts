
// import { AuthService } from './../../core/auth/services/auth-service';
// import { Product } from './../../core/models/product-cart';
// import { count, log } from 'node:console';
// import { CartService } from './../../core/services/cart-service';
// import { Component, computed, inject, OnInit, signal } from '@angular/core';
// import { ProductCart } from '../../core/models/product-cart';
// import { RouterLink } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { cart } from '../../core/models/cart';
// import { DecimalPipe } from '@angular/common';

// @Component({
//   selector: 'app-cart',
//   imports: [RouterLink ,DecimalPipe],
//   templateUrl: './cart.html',
//   styleUrl: './cart.css',
// })
// export class Cart implements OnInit {
//   cartService = inject(CartService);
//   authService = inject(AuthService);
//   toaster = inject(ToastrService);

//   productsList = signal<ProductCart[]>([]);
//   totalCount = signal(0);
//   totalPrice = signal(0);
//   cartDetails = signal<cart>({} as cart);

//   ngOnInit(): void {
//     this.getCartData();
//   }


// cartProgress = computed(() => {
//     const total = this.cartDetails().totalCartPrice || 0;
//     const target = 500; 
//     const percentage = (total / target) * 100;
//     return Math.min(percentage, 100); 
// });
  


//   getCartData() {
//     this.totalCount.set(0);
//     this.totalPrice.set(0);
//     if (this.authService.isUserLoggedIn() === true) {
//       this.cartService.getCartData().subscribe({
//         next: (res) => {
//           // console.log(res);
//           this.productsList.set(res.data.products);
//           this.cartDetails.set(res.data);
//           this.productsList().forEach((val) =>
//            this.totalCount.update((count) => count + val.count),
//           );
//           this.cartService.totalCartItems.set(this.totalCount());
//           this.productsList().forEach((val) =>
//             this.totalPrice.update((total) => total + val.count * val.price),
//           );
//         },
//         error: (err) => {
//           console.log(err);
//         },
//       });
//     } else {
//       let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
//       this.productsList.set(localCart['products']);
//       this.productsList().forEach((val) => this.totalCount.update((count) => count + val.count));
//       this.cartService.totalCartItems.set(this.totalCount());
//       this.productsList().forEach((val) =>
//       this.totalPrice.update((total) => total + val.count * val.price),
//       );
//     }
//   }

//   ClearAllItems() {
//     this.cartService.removeCartItems().subscribe({
//       next: (res) => {
//         this.productsList.set([]);
//         this.totalCount.set(0);
//         this.totalPrice.set(0);
//         this.cartService.totalCartItems.set(0);
//         this.toaster.success('cart cleared successfully', 'FreshCart');
//       },
//       error: (err) => {
//         console.log(err);
//         this.toaster.error(err.message || 'something went wrong!', 'FreshCart');
//       },
//     });
//   }

//   removeProduct(productId: string) {
//     this.cartService.removeSpecificCartItem(productId).subscribe({
//       next: (res) => {
//         console.log(res);
//         this.toaster.success('product removed successfully', 'FreshCart');
//         this.getCartData();
//       },
//       error: (err) => {
//         console.log(err);
//         this.toaster.error(err.message || 'something went wrong!', 'FreshCart');
//       },
//     });
//   }

//   updateProductQuantity(productId: string, count: number) {
//     this.cartService.updateProductQuantity(productId, count).subscribe({
//       next: (res) => {
//         console.log(res);
//         this.toaster.success('product quantity updated successfully', 'FreshCart');
//         this.productsList.set(res.data.products);
//         this.cartDetails.set(res.data);
//         this.totalCount.set(0);
//         this.totalPrice.set(0);
//         this.productsList().forEach((val) => this.totalCount.update((count) => count + val.count));
//         this.cartService.totalCartItems.set(this.totalCount());
//         this.productsList().forEach((val) =>
//           this.totalPrice.update((total) => total + val.count * val.price),
//         );
//         // this.getCartData();
//       },
//       error: (err) => {
//         console.log(err);
//         this.toaster.error(err.message || 'something went wrong!', 'FreshCart');
//       },
//     });
//   }
// }
