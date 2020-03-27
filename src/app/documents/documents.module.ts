import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentsComponent} from './documents.component';
import {DocumentsRoutingModule} from './documents-routing.module';
import {NzButtonModule, NzCardModule, NzResultModule} from 'ng-zorro-antd';
import {DocumentResolver} from './document.resolver';


@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    NzCardModule,
    NzButtonModule,
    NzResultModule
  ],
  providers: [DocumentResolver]
})
export class DocumentsModule {
}
