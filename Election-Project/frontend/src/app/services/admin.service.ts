import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AdminService{

    private url = 'http://localhost:3000/api/admins';

    constructor(private http: HttpClient){}

    createAdmin(payload: any): Observable<any>{
        return this.http.post(this.url, payload)
    }

    findAllAdmins(): Observable<any[]>{
        return this.http.get<any[]>(this.url)
    }

    findAdminById(adminId: string): Observable<any>{
        return this.http.get(`${this.url}/${adminId}`)
    }

    updateAdmin(adminId: string, payload: any): Observable<any>{
        return this.http.patch(`${this.url}/${adminId}`, payload)
    }

    deleteAdmin(adminId: string): Observable<any>{
        return this.http.delete(`${this.url}/${adminId}`)
    }
}