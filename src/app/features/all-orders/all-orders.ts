import { Orders } from './../../core/models/orders';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, Pipe, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { jwtDecode } from 'jwt-decode';
import { CartService } from '../../core/services/cart-service';
import { LoadingComponent } from "../../shared/ui/loading/loading";

@Component({
  selector: 'app-all-orders',
  imports: [RouterLink, DatePipe, DecimalPipe, LoadingComponent],
  templateUrl: './all-orders.html',
  styleUrl: './all-orders.css',
})
export class AllOrders implements OnInit {
  private readonly cartService = inject(CartService);
  OrdersList = signal<Orders[]>([]);
  isLoading = signal<boolean>(false);

  token: string = "";
  userId: string = ""; 
  platformId = inject(PLATFORM_ID);
  
  constructor() { 
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        this.token = savedToken;
        this.decodeUserData();
      }
    }
  }


  ngOnInit(): void {
  this.decodeUserData();
  if (this.userId) {
    this.getOrders();
  } else {
    console.error('User ID not found! Check your token.');
  }
}

decodeUserData() {
  try {
    const token = localStorage.getItem('userToken'); 
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id || decoded.sub;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}



  getOrders(): void {
    this.isLoading.set(true);
    this.cartService.getOrders(this.userId).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.OrdersList.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      }
    )

 }

  isDetailsVisible = signal(false);
  expandedOrderId = signal<string | null>(null);

  toggleDetails(orderId: string) {
   if (this.expandedOrderId() === orderId) {
    this.expandedOrderId.set(null);
  } else {
    this.expandedOrderId.set(orderId);
  };
  }
}