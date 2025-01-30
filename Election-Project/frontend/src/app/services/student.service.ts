import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class StudentService{
    private url = 'http://localhost:3000/api/students'

    constructor(private http: HttpClient){}

    findAllStudents(): Observable<any[]>{
        return this.http.get<any[]>(this.url)
    }

    findStudentById(studentId: string): Observable<any>{
        return this.http.get<any>(`${this.url}/${studentId}`)
    }

    findStudentByMatNumber(matNumber: string): Observable<any>{
        return this.http.get(`${this.url}/${matNumber}`)
    }

    addStudent(payload: any): Observable<any>{
        return this.http.post(this.url, payload)
    }

    updateStudent(studentId: string, payload: any): Observable<any>{
        return this.http.patch(`${this.url}/${studentId}`, payload)
    }

    deleteStudent(studentId: string): Observable<any>{
        return this.http.delete(`${this.url}/${studentId}`)
    }

}