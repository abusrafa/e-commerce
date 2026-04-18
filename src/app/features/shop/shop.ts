import { Component, inject, signal, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ProductsService } from '../../core/services/products-service';
import { AllBrands } from './../../core/services/all-brands';
import { IProduct, Subcategory } from '../../core/models/product-interface';
import { specificBrand } from '../../core/models/specificBrand';
import { ProductCard } from '../../shared/ui/product-card/product-card';
import { CategoriesServices } from '../../core/services/categories-services';
import { specificCategory } from '../../core/models/specificCategory';
import { LoadingComponent } from "../../shared/ui/loading/loading";


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductCard, RouterLink, LoadingComponent],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop implements OnInit, AfterViewInit {
  private activatedRoute = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private categoriesServices = inject(CategoriesServices);
  private allBrands = inject(AllBrands);

  productsList = signal<IProduct[]>([]);
  brandDetails = signal<specificBrand | null>(null);
  categoryDetails = signal<specificCategory | null>(null);
  subcategoryDetails = signal<any | null>(null);
  brandId = signal<string | null>(null);
  categoryId = signal<string | null>(null);
  subCategoryId = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  protected readonly Math = Math;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      const type = this.activatedRoute.snapshot.data['type'];

      if (id) {
        if (type === 'brand') {
          this.getBrandDetails(id);
          this.brandId.set(id);
        } else if (type === 'category') {
          this.getCategoryDetails(id);
          this.categoryId.set(id);
        } else if (type === 'subcategory') {
          this.getSubcategoryDetails(id);
          this.subCategoryId.set(id);
        }

        this.loadProducts(id, type);
      } else {
        this.brandDetails.set(null);
        this.loadProducts();
      }
    });
  }

  loadProducts(id: string | null = null, type: string | null = null): void {
    this.isLoading.set(true);
    const call = (id && type === 'category') ? this.productsService.getCategoryProducts(id) :
                 (id && type === 'subcategory') ? this.productsService.getSubcategoriesProducts(id) :
                 (id && type === 'brand') ? this.productsService.getBrandProducts(id) :
                 this.productsService.getAllProducts();

    call.subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  getBrandDetails(brandId: string): void {
    this.isLoading.set(true);
    this.allBrands.getSpecificBrand(brandId).subscribe({
      next: (res) => {
        this.brandDetails.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Brand Error:', err);
        this.isLoading.set(false);
      }
    });
  }

  getCategoryDetails(categoryId: string): void {
    this.isLoading.set(true);
    this.categoriesServices.getSpecificCategories(categoryId).subscribe({
      next: (res) => {
        this.categoryDetails.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Category Error:', err);
        this.isLoading.set(false);
      }
    });
  }

  getSubcategoryDetails(subCategoryId: string): void {
    this.isLoading.set(true);
    this.categoriesServices.getSubcategories(subCategoryId).subscribe({
      next: (res) => {
        this.subcategoryDetails.set(res);
        this.categoryId.set(res.data.category);
        this.getCategoryDetails(this.categoryId() as string);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Subcategory Error:', err);
        this.isLoading.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }
}