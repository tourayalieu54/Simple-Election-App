import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElectionService } from '../services/election.service';
import { CandidateService } from '../services/candidate.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-election-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './election-progress.component.html',
  styleUrls: ['./election-progress.component.css']
})
export class ElectionProgressComponent implements OnInit, OnDestroy {
  Object = Object;
  latestElection: any = null; // Store the latest election
  candidatesByPosition: { [key: string]: any[] } = {}; // Candidates organized by position
  winners: { [key: string]: any } = {}; // Store winners for each position
  voteChart: any; // Chart instance for displaying votes
  intervalId: any; // Store interval ID for cleanup

  constructor(
    private electionService: ElectionService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.fetchLatestElection();
    this.intervalId = setInterval(() => this.fetchLatestElection(), 60000); // Fetch latest elections every minute
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Clear interval when component is destroyed
    }
    this.voteChart?.destroy(); // Cleanup Chart.js instance
  }

  fetchLatestElection(): void {
    this.electionService.getElections().subscribe({
      next: data => {
        // Sort elections by startDate descending
        this.latestElection = data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

        if (this.latestElection && this.latestElection.isActive) {
          this.fetchCandidates(this.latestElection._id);
        } else if (this.latestElection) {
          this.setWinners(); // Set winners if the election has ended
        }
      },
      error: error => {
        console.error('Error fetching elections:', error);
      }
    });
  }

  fetchCandidates(electionId: string): void {
    this.candidateService.getCandidatesByElection(electionId).subscribe({
      next: candidates => {
        // Organize candidates by position
        this.candidatesByPosition = candidates.reduce((acc, candidate) => {
          if (!acc[candidate.position]) {
            acc[candidate.position] = [];
          }
          acc[candidate.position].push(candidate);
          return acc;
        }, {} as { [key: string]: any[] });

        // Display votes graphically
        this.displayVoteChart(candidates);
      },
      error: error => {
        console.error('Error fetching candidates:', error);
      }
    });
  }

  displayVoteChart(candidates: any[]): void {
    const positions = Object.keys(this.candidatesByPosition);
    const datasets = positions.map(position => ({
      label: position,
      data: this.candidatesByPosition[position].map(candidate => candidate.votes),
      backgroundColor: this.getRandomColor(), // Random color for each dataset
    }));

    const labels = candidates.map(candidate => `${candidate.candidateInfo.firstName} ${candidate.candidateInfo.lastName}`);

    // Destroy existing chart instance if it exists
    this.voteChart?.destroy();

    this.voteChart = new Chart('voteChart', {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setWinners(): void {
    if (this.latestElection) {
      this.winners['president'] = this.latestElection.president;
      this.winners['treasurer'] = this.latestElection.treasurer;
      this.winners['secretary'] = this.latestElection.secretary;
      this.winners['chairman_IEC'] = this.latestElection.chairman_IEC;
    }
  }
}
