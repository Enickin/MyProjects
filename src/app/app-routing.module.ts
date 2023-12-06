import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Componets/login/login.component';
import { SignupComponent } from './Componets/signup/signup.component';
import { DashboardComponent } from './Componets/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { AuthService } from './Services/auth.service';



const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch:'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService],
})
export class AppRoutingModule { }
