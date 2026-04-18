import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CategoriesSection } from './categories-section/categories-section';
import { ContactSection } from './contact-section/contact-section';
import { FeaturedProducts } from './featured-products/featured-products';
import { MainSlider } from './main-slider/main-slider';
import { Offers } from './offers/offers';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CategoriesSection,ContactSection,FeaturedProducts,MainSlider,Offers],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

private platId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
      import('flowbite').then((flowbite) => {
        flowbite.initFlowbite();
      });
    }
  }
}
