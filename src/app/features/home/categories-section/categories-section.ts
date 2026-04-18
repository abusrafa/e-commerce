import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesServices } from '../../../core/services/categories-services';
import { Category } from '../../../core/models/product-interface';
import { RouterLink } from "@angular/router";
import { LoadingComponent } from "../../../shared/ui/loading/loading";

@Component({
  selector: 'app-categories-section',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection implements OnInit {
  categoriesServices = inject(CategoriesServices);
  private cdr = inject(ChangeDetectorRef);
  categoriesList = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.isLoading.set(true);
    this.categoriesServices.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }
}