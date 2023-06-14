import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { JwtInterceptor } from './araguaia/interceptors/jwt.interceptor';
import { MessageService } from 'primeng/api';
import { AuthService } from './araguaia/service/auth.service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        AppLayoutModule,
    ],
    providers: [
        AuthService,
        MessageService,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
