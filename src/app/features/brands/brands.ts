import { Component, inject, signal } from '@angular/core';
import { AllBrands } from '../../core/services/all-brands';
import { Brand } from '../../core/models/product-interface';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-brands',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './brands.html',
  styleUrl: './brands.css',
})
export class Brands {
  allBrands = inject(AllBrands);
  brandsList = signal<Brand[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands() {
    this.isLoading.set(true);
    this.allBrands.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }
}