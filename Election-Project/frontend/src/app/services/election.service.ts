import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private baseUrl = 'http://localhost:3000/api/elections';

  constructor(private http: HttpClient) {}

  getElections(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getElectionById(id: String): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  createElection(election: any): Observable<any>{
    return this.http.post<any>(this.baseUrl, election)
  }

}
