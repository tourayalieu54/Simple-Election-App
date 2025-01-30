import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service'; // Adjust import paths as necessary
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent implements OnInit {
  candidate: any = null; // Store candidate information
  votes: number = 0; // Store number of votes

  constructor(
    private candidateService: CandidateService,
    private router: Router, private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCandidateInfo();
    this.getVotes();
  }

  getCandidateInfo(): void {
    const token = this.authService.getToken()
    const decodedToken = jwtDecode(token || '') as any;
    const referenceId = decodedToken.referenceId;

    this.candidateService.getCandidateById(referenceId).subscribe(candidate => {
      this.candidate = candidate;
    }, error => {
      console.error('Error fetching candidate info:', error);
    });
  }

  getVotes(): void {
    const token = sessionStorage.getItem('token');
    const decodedToken = jwtDecode(token || '') as any;
    const referenceId = decodedToken.referenceId;

    this.candidateService.getCandidateById(referenceId).subscribe(candidate => this.votes = candidate.vote);
  }

  
withdrawCandidacy(): void {
  if (confirm('Are you sure you want to withdraw your candidacy? This action cannot be undone.')) {
    const token = this.authService.getToken(); 
    const decodedToken = jwtDecode(token || '') as any;
    const referenceId = decodedToken.referenceId;

    this.handleWithdrawal(referenceId);
  }
}

handleWithdrawal(referenceId: string): void {
  
  this.candidateService.deleteCandidate(referenceId).subscribe({
  next: response => {
    alert('You have successfully withdrawn your candidacy.');
    this.router.navigate(['']); // Redirect to home
  },
  error: error => {
    console.error('Error withdrawing candidacy:', error);
    if(error.error?.isCustomError){
      alert(error.message)
    }
    else
      alert('Failed to withdraw candidacy. Please try again.');
    }
  })
}


  navigateToVote(): void {
    this.router.navigate(['/vote-candidates']);
  }
}
