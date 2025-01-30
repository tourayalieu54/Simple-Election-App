import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OfficerDashboardComponent } from './officer-dashboard/officer-dashboard.component';
import { NominationManagementComponent } from './nomination-management/nomination-management.component';
import { VoteCandidatesComponent } from './vote-candidates/vote-candidates.component';
import { ElectionProgressComponent } from './election-progress/election-progress.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AuthGuard } from './guards/auth.guards';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CandidateDashboardComponent } from './candidate-dashboard/candidate-dashboard.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'home', component: HomeComponent 
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signup', component: SignupComponent
    },
    {
        path: 'officer-dashboard', component: OfficerDashboardComponent, canActivate: [AuthGuard] //protecing the route
    },
    {
        path: 'manage-nominations', component: NominationManagementComponent, canActivate: [AuthGuard]
    },
    {
        path: 'vote-candidates', component: VoteCandidatesComponent, canActivate: [AuthGuard]
    },
    {
        path: 'election-progress', component: ElectionProgressComponent, canActivate: [AuthGuard]
    },
    {
        path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard]
    },
    {
        path: 'candidate-dashboard', component: CandidateDashboardComponent, canActivate: [AuthGuard]
    },
    {
        path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard]
    },
    {
        path: 'student-management', component: StudentManagementComponent, canActivate: [AuthGuard]
    },
    {
        path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
