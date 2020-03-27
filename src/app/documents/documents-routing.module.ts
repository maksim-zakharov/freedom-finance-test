import {Injectable, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentsComponent} from './documents.component';
import {DocumentResolver} from './document.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: DocumentsComponent,
    resolve: {document: DocumentResolver}
  },
  {
    path: '',
    redirectTo: '1' // для Теста
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {
}
