import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgZorroAntdModule, NZ_I18N, ru_RU} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData} from '@angular/common';
import ru from '@angular/common/locales/ru';
import {AuthService} from './core/auth.service';
import {AuthInterceptor} from './core/auth.interceptor';
import {AuthGuard} from './core/guards/auth.guard';
import {LayoutComponent} from './layout/layout.component';
import {FooterComponent} from './layout/footer/footer.component';
import {MainPageComponent} from './layout/main-page/main-page.component';
import {NotFoundComponent} from './core/not-found/not-found.component';
import {HeaderComponent} from './layout/header/header.component';

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MainPageComponent,
    NotFoundComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: NZ_I18N, useValue: ru_RU},
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
