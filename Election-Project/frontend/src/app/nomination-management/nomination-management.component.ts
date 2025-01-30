import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nomination-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nomination-management.component.html',
  styleUrl: './nomination-management.component.css'
})
export class NominationManagementComponent implements OnInit {
  nominations: any[] = [];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.getNominations();
  }

  getNominations(): void {
    this.candidateService.getAllCandidates().subscribe((candidates) => {
      this.nominations = candidates.filter(candidate => !candidate.isApproved);
    });
  }

  approveCandidate(candidateId: string): void {
    this.candidateService.updateCandidate(candidateId, { isApproved: true }).subscribe({
      next: response =>{
        console.log('Successful nomination approval, response:',response)
        alert('Nomination approved successfully');
        this.getNominations(); // Refresh list
      },
      error: error => {
        console.error('Error approving nomination:', error)
        if(error.isCustomError){
          alert(error.error.message)
        }
        else{
          alert('There was an error sending you approval request to the server, please try again!')
        }
      }
    });
  }

  deleteCandidate(candidateId: string): void {
    this.candidateService.deleteCandidate(candidateId).subscribe({
      next: response => {
        alert('Nomination request deleted successfully!');
        this.getNominations(); // Refresh list
      },
      error: error => {
        if(error.error.isCustomError){
          alert(error.error.message)
        }
        else{
          console.error('Error deleting nomination:', error)
          alert('There was a problem submitting nomination delete request, please try again!')
        }
      }
    });
  }
}
