import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import {jwtDecode} from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    
    private readonly tokenKey = 'nettadx01';
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient){}

    //save the token to session storage
    saveToken(token: string): void{
        sessionStorage.setItem(this.tokenKey, token)
    }

    // Get the token
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    // clearing the token
    clearToken(): void{
        sessionStorage.removeItem(this.tokenKey);
    }

    // Check if user is authenticated and whether the token expires
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }
    
        try {
            const decoded: any = jwtDecode(token);
            // Check if token is expired
            const isNotExpired = decoded.exp > Date.now() / 1000;
            return isNotExpired;
        } catch (error) {
            console.error('Error decoding token:', error);
            return false; 
        }
    }
    
    login(payload: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/login`, payload)
    }

    signup(payload: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/signup`, payload)
    }
}