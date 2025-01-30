import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoteService {
  private apiUrl = 'http://localhost:3000/api/candidates/votes';

  constructor(private http: HttpClient) {}

  castVote(vote: any): Observable<any> {
    return this.http.post(this.apiUrl, vote);
  }

  getVotes(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:3000/api/votes')
  }
}
