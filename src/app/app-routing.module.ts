import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './core/not-found/not-found.component';
import {AuthGuard} from './core/guards/auth.guard';
import {NeedLoginGuard} from './core/login/need-login.guard';
import {MainPageComponent} from './layout/main-page/main-page.component';
import {LayoutComponent} from './layout/layout.component';
import {InitializationGuard} from './core/guards/initialization.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [NeedLoginGuard],
    loadChildren: () => import('./core/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'access-denied',
    loadChildren: () => import('./core/access-denied/access-denied.module').then(m => m.AccessDeniedModule)
  },
  {
    path: '',
    canActivate: [InitializationGuard, AuthGuard],
    component: LayoutComponent,
    children: [
      {path: '', component: MainPageComponent},
      {
        path: 'documents',
        loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule),
      },
      {path: '**', component: NotFoundComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
