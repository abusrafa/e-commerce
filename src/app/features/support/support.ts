import { Component } from '@angular/core';
import { ɵInternalFormsSharedModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-support',
  imports: [ɵInternalFormsSharedModule, RouterLink],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support {}
