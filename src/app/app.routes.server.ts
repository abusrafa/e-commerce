import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'productDetails/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'Products/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'Products/brand/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'Products/category/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'Products/subcategory/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categories/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'checkout/:id',
    renderMode: RenderMode.Server,
  },

  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
