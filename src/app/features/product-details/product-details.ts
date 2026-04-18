import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart-service';
import { IProduct } from './../../core/models/product-interface';
import { ProductsService } from './../../core/services/products-service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-product-details',
  imports: [LoadingComponent],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  cartService = inject(CartService);
  toaster = inject(ToastrService);
  productDetails = signal<IProduct>({} as IProduct);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.getProductDetails(param.get('id') as string);
    });
  }

  getProductDetails(id: string) {
    this.isLoading.set(true);
    this.productsService.getSpecificProduct(id).subscribe({
      next: (res) => {
        this.productDetails.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  addToCart(productId: string) {
    this.isLoading.set(true);
    this.cartService.addToCart(productId).subscribe({
      next: (res) => {
        this.toaster.success("Product added successfully to your cart", "FreshCart");
        this.cartService.totalCartItems.update((val) => val + 1);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.toaster.error(err.message || "something went wrong!", "FreshCart");
        this.isLoading.set(false);
      },
    });
  }
}