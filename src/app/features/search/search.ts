import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../core/services/products-service';
import { CategoriesServices } from '../../core/services/categories-services';
import { AllBrands } from '../../core/services/all-brands';
import { Brand, Category, IProduct } from '../../core/models/product-interface';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, LoadingComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {

  private readonly _productsService = inject(ProductsService);
  private readonly _categoriesServices = inject(CategoriesServices);
  private readonly _allBrands = inject(AllBrands);
  private readonly activatedRoute = inject(ActivatedRoute);

  productsList: WritableSignal<IProduct[]> = signal([]);
  categoriesList = signal<Category[]>([]);
  brandsList = signal<Brand[]>([]);
  isLoading = signal<boolean>(false);

  searchTerm = signal<string>('');
  selectedCategories = signal<string[]>([]);
  selectedBrands = signal<string[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortOption = signal<string>('relevance');

  isGrid: boolean = true;
  isFilterOpen: boolean = false;

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllBrands();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm.set(params['q']);
        this.loadProducts();
      } else {
        this.loadProducts();
      }
    });
  }

  filteredProducts = computed(() => {
    let products = this.productsList().filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(this.searchTerm().toLowerCase());

      const matchesCategory = this.selectedCategories().length === 0 ||
        this.selectedCategories().includes(product.category.name);

      const matchesBrand = this.selectedBrands().length === 0 ||
        this.selectedBrands().includes(product.brand.name);

      const matchesMinPrice = this.minPrice() !== null ? product.price >= this.minPrice()! : true;
      const matchesMaxPrice = this.maxPrice() !== null ? product.price <= this.maxPrice()! : true;

      return matchesSearch && matchesCategory && matchesBrand && matchesMinPrice && matchesMaxPrice;
    });

    const option = this.sortOption();
    return [...products].sort((a, b) => {
      switch (option) {
        case 'priceLowHigh': return a.price - b.price;
        case 'priceHighLow': return b.price - a.price;
        case 'ratingHighLow': return b.ratingsAverage - a.ratingsAverage;
        case 'nameAZ': return a.title.localeCompare(b.title);
        case 'nameZA': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });
  });

  filteredCount = computed(() => this.filteredProducts().length);

  onSortChange(value: string): void {
    this.sortOption.set(value);
  }

  toggleSelection(list: 'cat' | 'brand', value: string): void {
    const currentList = list === 'cat' ? this.selectedCategories() : this.selectedBrands();
    const index = currentList.indexOf(value);

    if (index === -1) {
      list === 'cat' ? this.selectedCategories.set([...currentList, value]) :
        this.selectedBrands.set([...currentList, value]);
    } else {
      const newList = currentList.filter(item => item !== value);
      list === 'cat' ? this.selectedCategories.set(newList) :
        this.selectedBrands.set(newList);
    }
  }

  clearAllFilters(): void {
    this.searchTerm.set('');
    this.selectedCategories.set([]);
    this.selectedBrands.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortOption.set('relevance');
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  loadProducts(id: string | null = null, type: string | null = null): void {
    this.isLoading.set(true);
    let productObservable;
    if (id && type) {
      if (type === 'category') productObservable = this._productsService.getCategoryProducts(id);
      else if (type === 'subcategory') productObservable = this._productsService.getSubcategoriesProducts(id);
      else if (type === 'brand') productObservable = this._productsService.getBrandProducts(id);
      else productObservable = this._productsService.getAllProducts();
    } else {
      productObservable = this._productsService.getAllProducts();
    }

    productObservable.subscribe({
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

  getAllCategories(): void {
    this.isLoading.set(true);
    this._categoriesServices.getAllCategories().subscribe({
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

  getAllBrands(): void {
    this.isLoading.set(true);
    this._allBrands.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

}