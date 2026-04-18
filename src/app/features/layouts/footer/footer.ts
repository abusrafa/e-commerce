import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {

private platId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platId)) {
      import('flowbite').then((flowbite) => {
        flowbite.initFlowbite();
      });
    }
  }

  
}

