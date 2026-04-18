import { cart } from './../../core/models/cart';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart-service';
import { DecimalPipe } from '@angular/common';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe, LoadingComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)
  cartId = signal<string>('');
  isLoading = signal<boolean>(false);

  selectedPayment = signal<string>('cash'); 
  cartDetails = signal<cart>({} as cart);

  selectPayment(type: string) {
    this.selectedPayment.set(type);
  }

  checkOut: FormGroup = this.fb.group({
    shippingAddress: this.fb.group({
      details: ["", [Validators.required]],
      phone: ["", [Validators.required]],
      city: ["", [Validators.required]],
    }),
  });

  submitForm(): void {
    if (this.checkOut.valid) {
      this.isLoading.set(true);
      if (this.selectedPayment() === 'cash') {
        this.cartService.cashPayment(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.isLoading.set(false);
              this.router.navigate(['/allorders'])
            }
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
          }
        })
      }
      else if (this.selectedPayment() === 'visa') {
        this.cartService.visaPayment(this.cartId(), this.checkOut.value).subscribe({
          next: (res) => {
            if (res.status === 'success') {
              this.isLoading.set(false);
              window.open(res.session.url , '_self')
            }
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
          }
        })
      }
    }
  }

  ngOnInit(): void {
    this.getCartData()
  }

  getCartData() {
    this.isLoading.set(true);
    this.cartService.getCartData().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.cartId.set(res.data._id);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    })
  }
}