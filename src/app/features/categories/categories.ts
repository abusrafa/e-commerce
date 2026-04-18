import { Component, inject, signal } from '@angular/core';
import { CategoriesServices } from '../../core/services/categories-services';
import { Category } from '../../core/models/product-interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { specificCategory } from '../../core/models/specificCategory';
import { initFlowbite } from 'flowbite';
import { Subcategories } from "../subcategories/subcategories";
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-categories',
  imports: [RouterLink, Subcategories, LoadingComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private categoriesServices = inject(CategoriesServices);
  private activatedRoute = inject(ActivatedRoute);

  categoriesList = signal<Category[]>([]);
  categoryDetails = signal<specificCategory | null>(null);
  categoryId = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.categoryId.set(id);

      if (id) {
        this.getCategoryDetails(id);
      } else {
        this.getAllCategories();
      }
    });
  }

  ngAfterViewInit(): void {
    initFlowbite();
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

  getAllCategories(): void {
    this.isLoading.set(true);
    this.categoriesServices.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(id: string) {
    this.categoryId.set(id);
    this.getCategoryDetails(id);
  }

  resetSelection() {
    this.categoryId.set(null);
  }
}