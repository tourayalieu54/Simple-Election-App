import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class UserService{

    private url = 'http://localhost:3000/api/users' 

    constructor(private http: HttpClient){}

    findAllUsers(): Observable<any>{
        return this.http.get(this.url);
    }

    findUserProfile(): Observable<any>{
        return this.http.get(this.url.replace('/users', '/profile'))
    }

    findUserByReferenceId(referenceId: string): Observable<any>{
        return this.http.get(`${this.url.slice(0, this.url.length-1)}/${referenceId}`)
    }

    updateUser(userId: string, payload: any): Observable<any>{
        return this.http.patch(`${this.url}/${userId}`, payload)
    }

    deleteUser(userId: string): Observable<any>{
        return this.http.delete(`${this.url}/${userId}`)
    }
}

