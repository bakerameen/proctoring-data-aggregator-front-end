import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/auth/auth.guard';

import { SignupComponent } from './components/auth/signup/signup/signup.component';
import { ComplexComponent } from './components/complex/complex.component';
import { QuestionsComponent} from './components/questions/questions.component';




import { ThanksComponent } from './components/thanks/thanks.component'



const routes: Routes = [
  { path: '', component: SignupComponent  },    
  { path: 'questions/:userId', component: QuestionsComponent},  
  { path: 'signup', component: SignupComponent},
  { path: 'thanks/:userId', component: ThanksComponent},
  { path: 'complex/:userId', component:ComplexComponent}

];

@NgModule({
imports: [RouterModule.forRoot(routes)],

exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
