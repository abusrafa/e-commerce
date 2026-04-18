import { isPlatformBrowser } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-main-slider',
  imports: [],
  templateUrl: './main-slider.html',
  styleUrl: './main-slider.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainSlider implements OnInit {


  private platId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
      import('flowbite').then((flowbite) => {
        flowbite.initFlowbite();
      });
    }
  }
}


