import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {jwtDecode} from 'jwt-decode';
import { CandidateService } from '../services/candidate.service'; // Adjust import paths as necessary
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ElectionService } from '../services/election.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  nominationForm!: FormGroup; // Form for nominations
  showModal = false; // Control modal visibility
  studentName: string = '';
  activeElection: any;
  candidatePartyPositionDuplicationError: boolean = false;

  parties = [
    { value: 'Solutionist Party', label: 'Solutionist Party' },
    { value: 'Alliance Party', label: 'Alliance Party' },
    { value: 'Independent', label: 'Independent' }
  ];

  positions = [
    { value: 'chairman_IEC', label: 'Chairman-IEC' },
    { value: 'president', label: 'President' },
    { value: 'treasurer', label: 'Treasurer' },
    { value: 'secretary', label: 'Secretary' }
  ];

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private router: Router,
    private authService: AuthService,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchStudentNames();
  }

  initializeForm(): void {
    this.nominationForm = this.fb.group({
      party: ['', Validators.required],
      position: ['', Validators.required]
    });
  }

  fetchStudentNames(){
    const token = this.authService.getToken();
    const decodedToken = jwtDecode(token || '') as any;
    fetch(`http://localhost:3000/api/students/${decodedToken.referenceId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(
      response => {
        if(!response.ok){
          throw new Error('Error, failed to fetch student')
        }
        return response.json()
      })
    .then(payload => this.studentName = `${payload.firstName} ${payload.middleName || ''} ${payload.lastName}`)
    .catch(error => console.error('Error fetching the student:', error))
    //this.studentName = `${decodedToken.referenceId.firstName} ${decodedToken.referenceId.middleName || ''} ${decodedToken.referenceId.lastName}`
    console.log('The fetched student name is: ',this.studentName)
  }

  openNominationModal(): void {
    this.showModal = true; // Show the modal
  }

  onSubmitNomination(): void {
    if (this.nominationForm.valid) {
      const { party, position } = this.nominationForm.value;

      // Decode JWT to get referenceId
      const token = this.authService.getToken();
      const decodedToken = jwtDecode(token || '') as any;
      const referenceId = decodedToken.referenceId;

      const candidateData = {
        party,
        position,
        candidateInfo: referenceId // Set candidateInfo to referenceId
      };

      // Call service to create a candidate (nomination)
      this.candidateService.createCandidate(candidateData).subscribe({ next: response => {
          alert('Nomination submitted successfully!');
          this.showModal = false; // Close modal
          this.nominationForm.reset(); // Reset form
        },
        error: error => {
          if(error.error?.isCustomError){
            alert(error.error?.message)
          }
          else{
              console.error('Error submitting nomination:', error);
              alert('Failed to submit nomination. Please try again.');
          }
          this.nominationForm.reset()
        }
      })
    }
  }

  onCancel(): void {
    this.showModal = false; // Close modal without saving
    this.nominationForm.reset(); // Reset form
  }

  navigateToVote(): void {
    this.router.navigate(['/vote-candidates']); // Navigate to voting route
  }
}
