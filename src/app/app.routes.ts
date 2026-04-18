import { Routes } from '@angular/router';
import { mainGuard } from './core/auth/gaurds/main-guard';
import { guestGuard } from './core/auth/gaurds/guest-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'home page',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    title: 'login page',
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/forgot-password/forgot-password').then((m) => m.ForgotPassword),
    title: 'forgotPassword page',
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/register/register').then((m) => m.Register),
    title: 'register page',
  },





  {
    path: 'Products/:id',
    loadComponent: () => import('./features/shop/shop').then((m) => m.Shop),
    title: 'Products page',
  },
{
  path: 'Products/brand/:id',
  loadComponent: () => import('./features/shop/shop').then((m) => m.Shop),
  data: { type: 'brand' },
  title: 'Brand Products'
},
{
  path: 'Products/category/:id',
  loadComponent: () => import('./features/shop/shop').then((m) => m.Shop),
  data: { type: 'category' },
  title: 'Category Products'
},
{
  path: 'Products/subcategory/:id',
  loadComponent: () => import('./features/shop/shop').then((m) => m.Shop),
  data: { type: 'subcategory' },
  title: 'Category Products'
},




  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
    title: 'categories page',
  },
  {
    path: 'categories/:id',
    loadComponent: () => import('./features/categories/categories').then((m) => m.Categories),
    title: 'categories page',
  },
  {
    path: 'brands',
    loadComponent: () => import('./features/brands/brands').then((m) => m.Brands),
    title: 'brands page',
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support').then((m) => m.Support),
    title: 'support page',
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist').then((m) => m.Wishlist),
    title: 'wishlist page',
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
    title: 'cart page',
  },
  {
    path: 'checkout/:id',
    canActivate: [mainGuard],
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.Checkout),
    title: 'checkout page',
  },
  {
    path: 'allorders',
    canActivate: [mainGuard],
    loadComponent: () => import('./features/all-orders/all-orders').then((m) => m.AllOrders),
    title: 'all Orders page',
  },
  
{
    path: 'profile',
    canActivate: [mainGuard],
    title: 'profile page',
    loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
    children: [
      {
        path: '',
        redirectTo: 'addresses',
        pathMatch: 'full'
      },
      {
        path: 'addresses',
        loadComponent: () => import('./features/profile/addresses/addresses').then((m) => m.Addresses),
        title: 'addresses page',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/profile/settings/settings').then((m) => m.Settings),
        title: 'settings page',
      },
    ]
  },
  {
    path: 'productDetails/:id',
    loadComponent: () =>
      import('./features/product-details/product-details').then((m) => m.ProductDetails),
    title: 'product Details page',
  },
  {
    path: 'subcategories', ///:id
    loadComponent: () =>
      import('./features/subcategories/subcategories').then((m) => m.Subcategories),
    title: 'Subcategories page',
  },
  
    {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((m) => m.Search),
    title: 'search page',
  },


  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
    title: 'notFound page',
  },
];
