import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentsComponent} from './documents.component';
import {DocumentsRoutingModule} from './documents-routing.module';
import {NzButtonModule, NzCardModule, NzFormModule, NzInputModule, NzResultModule, NzSelectModule} from 'ng-zorro-antd';
import {DocumentResolver} from './document.resolver';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [DocumentsComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    NzCardModule,
    NzButtonModule,
    NzResultModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzFormModule
  ],
  providers: [DocumentResolver]
})
export class DocumentsModule {
}
