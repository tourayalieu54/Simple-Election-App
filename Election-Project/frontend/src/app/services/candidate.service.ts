import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; // Observable helps in asynchronous data delivery, its more like a promise but more powerfull and it's two (sending/receiving)

//Needed for dependency injection (In this case makes the service globally available every file that needs it withing this project)
@Injectable({
  providedIn: 'root',
})
export class CandidateService {

  private apiUrl = 'http://localhost:3000/api/candidates';

  //HttpClient gets injected into the http varaibale which enables us to commune with tha backend(queries)
  constructor(private http: HttpClient) {}

  // Get all candidates
  getAllCandidates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get a candidate by ID
  getCandidateById(candidateId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${candidateId}`);
  }

  // Get candidates by position
  getCandidatesByPosition(position: string): Observable<any[]> {
    const candidates = this.http.get<any[]>(`${this.apiUrl}/fetch/${position}`);
    candidates.forEach(candidate => console.log(candidate))
    return candidates;
  }

  //get candidates by electionid
  getCandidatesByElection(id: string): Observable<any[]> {
    const candidates = this.http.get<any[]>(`${this.apiUrl}/election/${id}`);
    candidates.forEach(candidate => console.log(candidate))
    return candidates;
  }

  // Create a new candidate
  createCandidate(candidateData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, candidateData);
  }

  // Update a candidate
  updateCandidate(candidateId: string, candidateData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${candidateId}`, candidateData);
  }

  // Delete a candidate
  deleteCandidate(candidateId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${candidateId}`);
  }
}
