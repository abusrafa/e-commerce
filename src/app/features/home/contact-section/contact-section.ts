import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { LoadingComponent } from "../../../shared/ui/loading/loading";

@Component({
  selector: 'app-contact-section',
  imports: [LoadingComponent],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.css',
})
export class ContactSection implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }
}
