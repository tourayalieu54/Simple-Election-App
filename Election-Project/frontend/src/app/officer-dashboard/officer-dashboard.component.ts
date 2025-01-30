import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../services/election.service';
import { CandidateService } from '../services/candidate.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.css']
})
export class OfficerDashboardComponent implements OnInit {
  elections: any[] = [];
  candidates: any[] = [];
  approvedNominationsCount = 0;
  unapprovedNominationsCount = 0;
  activeElection: any = null; // Track active election
  createElectionForm: FormGroup;  // Form group for creating election
  showModal: boolean = false;  // Control modal visibility

  constructor(
    private electionService: ElectionService,
    private candidateService: CandidateService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize the form with validators
    this.createElectionForm = this.fb.group({
      startDate: ['', Validators.required],
      duration: [0.1, [Validators.required, Validators.min(0.1)]]
    });
  }

  ngOnInit(): void {
    // Fetch elections and candidates on init
    this.getElections();
    this.getCandidates();
    this.fetchNominationCounts();
  }

  fetchNominationCounts(): void {
    this.candidateService.getAllCandidates().subscribe((candidates) => {
      const currentCandidates = candidates.filter(candidate => candidate.electionId===this.activeElection?._id)
      this.approvedNominationsCount = currentCandidates.filter(c => c.isApproved).length;
      this.unapprovedNominationsCount = currentCandidates.filter(c => !c.isApproved).length;
    });
  }

  // Fetch elections
  getElections(): void {
    this.electionService.getElections().subscribe(elections => {
      this.elections = elections;
      this.activeElection = elections.find(election => election.isActive);
    });
  }

  // Fetch candidates
  getCandidates(): void {
    this.candidateService.getAllCandidates().subscribe(candidates => {
      this.candidates = candidates;
    });
  }

  // Open the modal form for creating election
  openCreateElectionModal(): void {
    if (this.activeElection) {
      alert('An election is already active. You cannot create a new election.');
    } else {
      this.showModal = true;  // Show the modal
    }
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false;  // Hide the modal
  }

  // Handle form submission
  onSubmit(): void {
    if (this.createElectionForm.valid) {
      const electionData = this.createElectionForm.value;
      this.electionService.createElection(electionData).subscribe({
        next: newElection => {
          alert('Election created successfully!');
          this.getElections();  // Refresh elections
          this.closeModal();  // Close modal
          //console.log('Response:', newElection)
        },
        error: error => {
          console.error('Error creating election:', error);
          if(error.error.isCustomError){
            alert(error.error.message)
          }else{
            alert('Error creating election.');
          }
        }
    });
    }
  }

  // View Election Progress action
  viewElectionProgress(): void {
    this.router.navigate(['/election-progress']);  // assuming there's a route to view election progress
  }
}
