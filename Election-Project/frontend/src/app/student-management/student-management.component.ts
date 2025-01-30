import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.css'
})
export class StudentManagementComponent implements OnInit{
  students: any = [];
  filteredStudents: any[] = [];
  matNumberSearchForm!: FormGroup;
  searchMatNumber: string = '';
  studentForm!: FormGroup;
  showStudentFormModal: boolean = false;
  wannaUpdateStudent: boolean = false;
  wannaAddStudent: boolean = false;
  wannaDeleteStudent: boolean = false;
  temporalStudentUpdateData: any;
  showUpdateStudentConfirmation: boolean = false;
  updatingStudentId: string = '';
  deletingStudentId: string = '';
  

  constructor(private studentService: StudentService, private fb: FormBuilder){
    this.matNumberSearchForm = this.fb.group({
      matNumber: ['']
    })
    this.studentForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      matNumber: [''],
      department: ['']
    })
  }

  ngOnInit(): void {
    this.fetchAllStudents();
  }

 

  fetchAllStudents(): void{
    this.studentService.findAllStudents().subscribe({
      next: students => {
        this.students = students;
        this.filteredStudents = this.students;
        console.log('Students fetched successfully:', students)
      },
      error: error => {
        console.error('Error fetching students:', error)
      }
    })
  }

  fetchStudents(): void{
    this.searchMatNumber = this.matNumberSearchForm.value.matNumber;
    this.filteredStudents = this.students.filter((student: {matNumber: string}) => student.matNumber.includes(this.searchMatNumber))
  }

  setToUpdate(student: any): void{
    this.updatingStudentId = student._id;
    this.initializeFormForUpdates(student)
    this.showStudentFormModal = true;
    this.wannaUpdateStudent = true;
    this.showUpdateStudentConfirmation = false;
    //this.temporalStudentUpdateData = this.studentForm.value;
    
  }

  initializeFormForUpdates(student: any): void{
    this.studentForm = this.fb.group({
      firstName: [student?.firstName],
      middleName: [student?.middleName || ''],
      lastName: [student?.lastName],
      matNumber: [student?.matNumber],
      department: [student?.department]
    })
  }

  decideSubmission(): void{
    if(this.wannaUpdateStudent){
      this.updateStudent();
    }
    if(this.wannaAddStudent){
      console.log('Yes we reach the decideSubmission function and about to run the add student method!')
      this.addStudent();
    }
  }

  updateConfirmed(): void{
    this.temporalStudentUpdateData = this.studentForm.value;
    this.showUpdateStudentConfirmation = true;
  }


  updateStudent(): void{
    if(this.studentForm.valid){
      this.studentService.updateStudent(this.updatingStudentId, this.temporalStudentUpdateData).subscribe({
        next: result => {
          alert('Update Student Successful!')
          this.fetchAllStudents();
          this.showStudentFormModal = false;
          this.wannaUpdateStudent = false;
          this.showUpdateStudentConfirmation = false;
          this.studentForm.reset();
        },
        error: error => {
          this.wannaUpdateStudent = false;
          this.showUpdateStudentConfirmation = false;
          console.error('There was an error submitting the update:', error)
          if(error.isCustomError){
            alert(error.message)
          }else{
            alert('There was an error submitting your update request, please try again!')
          }
        }
      })
    }
  }

  closeModal(): void{
    this.showStudentFormModal = false;
    this.wannaAddStudent = false;
    this.wannaUpdateStudent = false;
    this.wannaDeleteStudent = false;
    this.studentForm.reset();
  }

  goToDeleteStudentConfirmation(student: any): void{
    this.temporalStudentUpdateData = student;
    this.deletingStudentId = student._id;
    this.showStudentFormModal = true;
    this.wannaDeleteStudent = true;
  }

  deleteStudent(): void{
    this.studentService.deleteStudent(this.deletingStudentId).subscribe({
      next: result => {
        alert('Student deleted successfully')
        this.fetchAllStudents();
        this.wannaDeleteStudent = false;
        this.showStudentFormModal = false;
      },
      error: error => {
        console.error('There was an error deleting student:', error)
        if(error.isCustomError){
          alert(error.message)
        }else{
          alert('There was an error submitting your student delete request, please try again!')
        }
        this.wannaDeleteStudent = false;
      }
    })
  }

  iniateAddingStudent(): void{
    this.wannaAddStudent = true;
    this.showStudentFormModal = true;
  }

  addStudent(): void{
    const payload = this.studentForm.value;
    this.studentService.addStudent(payload).subscribe({
      next: result => {
        this.fetchAllStudents()
        alert('Student added successfully!');
        this.wannaAddStudent = false;
        this.showStudentFormModal = false;
      },
      error: error => {
        console.error('Error adding student:', error)
        if(error.isCustomError){
          alert(error.message)
        }
        else{
          alert('There\'s been an error adding student, you might wanna try again!')
        }
      }
    })
  }

}
