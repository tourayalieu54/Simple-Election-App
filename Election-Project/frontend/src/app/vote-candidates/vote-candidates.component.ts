import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VoteService } from '../services/vote.service';
import { CandidateService } from '../services/candidate.service';
import { ElectionService } from '../services/election.service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-vote-candidates',
  standalone: true,
  templateUrl: './vote-candidates.component.html',
  styleUrls: ['./vote-candidates.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [VoteService, CandidateService, ElectionService, AuthService], // Provide required services
})
export class VoteCandidatesComponent implements OnInit {
  Object = Object; 
  voteForms!: FormGroup;
  activeElection: any = null;
  candidatesByPosition: { [key: string]: any[] } = {};
  showCheckBoxes: boolean = true;
  hasVoted: boolean = false;
  voterId: string = '';

  constructor(
    private fb: FormBuilder,
    private voteService: VoteService,
    private candidateService: CandidateService,
    private electionService: ElectionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeVoterId();
    this.fetchActiveElection();
    this.verifyIfUserVoted();
  }

  initializeVoterId(): void {
    const token = this.authService.getToken();
    const decodedToken = jwtDecode(token || '') as any;
    alert(`Token ${token} UserID: ${decodedToken.id}`)
    this.voterId = decodedToken.id; 
  }

  verifyIfUserVoted(): void {
    this.voteService.getVotes().subscribe({
      next: (votes) => {
        const userVote = votes.find((vote: { voterId: string }) => vote.voterId === this.voterId);
        if (userVote) {
          this.hasVoted = true;
          this.showCheckBoxes = false;
        }
      },
      error: (error) => console.error('Error fetching votes:', error),
    });
  }

  fetchActiveElection(): void {
    this.electionService.getElections().subscribe(
      (data) => {
        const activeElections = data.filter((election) => election.isActive);
        if (activeElections.length > 0) {
          this.activeElection = activeElections[0];
          this.fetchCandidates(this.activeElection._id);
        }
      },
      (error) => console.error('Error fetching elections:', error)
    );
  }

  fetchCandidates(electionId: string): void {
    this.candidateService.getCandidatesByElection(electionId).subscribe(
      (candidates) => {
        const approvedCandidates = candidates.filter((cand) => cand.isApproved);
        this.candidatesByPosition = approvedCandidates.reduce((acc, candidate) => {
          if (!acc[candidate.position]) {
            acc[candidate.position] = [];
          }
          acc[candidate.position].push(candidate);
          return acc;
        }, {} as { [key: string]: any[] });

        this.createVoteForm();
      },
      (error) => console.error('Error fetching candidates:', error)
    );
  }

  createVoteForm(): void {
    const formControls = Object.keys(this.candidatesByPosition).reduce((acc, position) => {
      acc[position] = this.fb.control('');
      return acc;
    }, {} as { [key: string]: any });

    this.voteForms = this.fb.group(formControls);
  }

  onSubmitVotes(): void {
    const selectedVotes = Object.entries(this.voteForms.value)
      .filter(([position, candidateId]) => candidateId)
      .map(([position, candidateId]) => ({
        voterId: this.voterId,
        candidateId,
        position,
        electionId: this.activeElection?._id,
      }));

    if (selectedVotes.length !== Object.keys(this.candidatesByPosition).length) {
      alert('Please vote for one candidate in each position.');
      return;
    }

    selectedVotes.forEach((vote) => {
      this.voteService.castVote(vote).subscribe({
        next: () => {
          console.log(`Vote for ${vote.position} submitted successfully.`);
        },
        error: (error) => {
          console.error(`Error submitting vote for ${vote.position}:`, error);
          if (error.error.isCustomError) {
            alert(error.error.message);
          } else {
            alert('Error submitting one or more votes. Please try again.');
          }
        },
      });
    });

    alert('All votes successfully submitted!');
    this.hasVoted = true;
    this.showCheckBoxes = false;
  }
}
