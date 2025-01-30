import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ElectoralOfficer{

    private url = 'http://localhost:3000/api/electoralOfficer'

    constructor(private http: HttpClient){}

    findAllOfficers(): Observable<any>{
        return this.http.get<any>(this.url);
    }
}