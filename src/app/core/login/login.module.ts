import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import {NzButtonModule, NzCardModule, NzFormModule, NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    NzFormModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    ReactiveFormsModule,
    NzInputModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
