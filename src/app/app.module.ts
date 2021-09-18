// Angualr Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';

// components
import { AppComponent } from './app.component';

import { HeaderComponent } from './components/layouts/header/header.component';
import { FooterComponent } from './components/layouts/footer/footer.component';

import { AppRoutingModule } from './app-routing.module';


import { SignupComponent } from './components/auth/signup/signup/signup.component';
import { AuthIntercepter } from './components/auth/auth-intercepter';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './components/error/error.component';


// Material
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';


import { CountdownModule } from 'ngx-countdown';
import { ThanksComponent } from './components/thanks/thanks.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { ComplexComponent } from './components/complex/complex.component';





@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    
    SignupComponent,
    ErrorComponent,
    ThanksComponent,
    QuestionsComponent,
    ComplexComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatBadgeModule,
    MatSnackBarModule,
    AppRoutingModule,
    CountdownModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatRadioModule,
    FlexLayoutModule,
    MatGridListModule,
    MatStepperModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
  // entryComponents This inform Angular to run it even don't see it

})
export class AppModule { }
