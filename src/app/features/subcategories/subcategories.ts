import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesServices } from '../../core/services/categories-services';
import { specificCategory } from '../../core/models/specificCategory';
import { GetAllSubCategoriesOnCategory } from '../../core/models/get-all-sub-categories-on-category';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-subcategories',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './subcategories.html',
  styleUrl: './subcategories.css',
})
export class Subcategories {

  activatedRoute = inject(ActivatedRoute)
  categoriesServices = inject(CategoriesServices)
  categoryName = signal<string | null>(null);
  subcategoryDetails = signal<any | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id') as string;
      this.getSubcategoryDetails(id)
      this.getCategoryName(id)
      this.getSub_Category(id)
    })
  }

  getSubcategoryDetails(id: string) {
    this.isLoading.set(true);
    this.categoriesServices.getAllSubCategoriesOnCategory(id).subscribe({
      next: (res) => {
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }

  getCategoryName(id: string) {
    this.isLoading.set(true);
    this.categoriesServices.getSpecificCategories(id).subscribe({
      next: (res) => {
        this.categoryName.set(res.data.name)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }

  getSub_Category(id: string) {
    this.isLoading.set(true);
    this.categoriesServices.getSub_Category(id).subscribe({
      next: (res) => {
        this.subcategoryDetails.set(res.data)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }
}