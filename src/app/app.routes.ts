import { Routes } from '@angular/router';
import { ExpensetableComponent } from './expense-table/expense-table.component';
import { BudgetComponent } from './budget/budget.component';
import { RappelsConseilsComponent } from './rappels-conseils/rappels-conseils.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/historique', pathMatch: 'full' },
  { path: 'historique', component: ExpensetableComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'rappels-et-conseils', component: RappelsConseilsComponent }, // Placeholder
  { path: 'settings', component: ExpensetableComponent }, // Placeholder
  { path: 'sign-in', component: SignInFormComponent },
];