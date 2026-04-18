import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ProductsService } from '../../../core/services/products-service';
import { IProduct } from '../../../core/models/product-interface';
import { RouterLink } from "@angular/router";
import { ProductCard } from "../../../shared/ui/product-card/product-card";
import { LoadingComponent } from "../../../shared/ui/loading/loading";

@Component({
  selector: 'app-featured-products',
  imports: [ProductCard, LoadingComponent],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css',
})
export class FeaturedProducts implements OnInit {
  productsService = inject(ProductsService);
  productsList = signal<IProduct[]>([]);
  isLoading = signal<boolean>(false);
  protected readonly Math = Math;

  ngOnInit(): void {
    initFlowbite();
    this.getProducts();
  }

  getProducts() {
    this.isLoading.set(true);
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    });
  }
}