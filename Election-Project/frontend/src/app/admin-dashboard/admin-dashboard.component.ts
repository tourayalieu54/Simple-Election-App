import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ElectoralOfficer } from '../services/electoralOfficer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{
  adminName: string = '';
  admin:any;
  addAdminForm!: FormGroup;
  updateAdminInfo!: FormGroup;
  showModal: boolean = false;
  showConfirmation: boolean = false;
  temporalPayload: any; // when admin tries update his info
  showResignationConfirmationModal: boolean = false;
  resignConfirmed: boolean = false;
  showAddAdminModal: boolean = false;
  electoralOfficer: any;
  officerUserAccount: any;
  showElectoralOfficer: boolean = false;

  constructor(private adminService: AdminService, private authService: AuthService, private fb: FormBuilder, private router: Router, private officerService: ElectoralOfficer, private userService: UserService){}

  ngOnInit(): void {
    this.updateAdminInfo = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      occupation: ['']
    })
    this.getTheAdmin()
    this.inializeAddAdminForm();
    this.getTheElectoralOfficer();
  }

  inializeAddAdminForm(): void{
    this.addAdminForm = this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: [''],
      occupation: [''],
      staffId: ['']
    })
  }

  getTheAdmin(): void {
    const token = this.authService.getToken()
    const decodedToken = jwtDecode(token || '')as any;
    this.adminService.findAdminById(decodedToken.referenceId).subscribe({
      next: admin => {
        this.admin = admin
        this.adminName = `${this.admin.firstName} ${this.admin.middleName || ''} ${this.admin.lastName}`
      },
      error: error => {
        console.error('Error fetching admin object:',error);
      }
    })
  }

  getTheElectoralOfficer(): void{
    this.officerService.findAllOfficers().subscribe({
      next: response => {
        this.electoralOfficer = response[0];
        console.log(this.electoralOfficer.officerInfo.firstName)
        this.userService.findUserByReferenceId(this.electoralOfficer._id).subscribe({
          next: response => {
            this.officerUserAccount = response;
          },
          error: error => {
            console.error('Error fetching the admin user account:', error)
          }
        })
      },
      error: error =>{
        error('Error fetching electoral officer:', error)
      }
    })
  }

  onClickUpdateAdminButton(): void{
    this.initializeForm();
    this.showConfirmation = false;
    this.showModal = true;
  }

  initializeForm(): void {
    this.updateAdminInfo = this.fb.group({
      firstName: [this.admin.firstName],
      middleName: [this.admin.middleName || ''],
      lastName: [this.admin.lastName],
      occupation: [this.admin.occupation],
    });
  }

  closeModal(): void{
    this.showModal = false;
    this.showResignationConfirmationModal = false;
  }
  invokeConfirmation(): void{
    this.temporalPayload = this.updateAdminInfo.value;
    this.showConfirmation = true;
  }
  onSubmit(): void{
    this.adminService.updateAdmin(this.admin._id, this.updateAdminInfo.value).subscribe({
      next: response => {
        alert('Update successful!')
        this.getTheAdmin()
        this.showModal = false;
      },
      error: error => {
        if(error.isCustomError){
          alert(error.message)
        }
        else{
          alert('Update failed, try again')
        }
        console.error('Error updating admin info:', error)
      }
    })
  }

  onClickResignationButton():void {
    this.showResignationConfirmationModal = true;
  }

  setResignationConfirmation(): void{
    this.resignConfirmed = true;
    this.onResign()
  }

  onResign(): void{
    if(this.resignConfirmed){
      this.adminService.deleteAdmin(this.admin._id).subscribe({
        next: result => {
          alert ('Resignation Successful!')
          this.router.navigateByUrl('/home')
          console.log(result)
        },
        error : error => {
          if(error.isCustomError){
            alert(error.message)
          }
          else{
            alert('There was an error while submitting your resignation, please try again!')
            console.error('There was a problem submitting this resignation: ', error)
          }
          this.showResignationConfirmationModal = false;
        }
      })
    }
  }
  
  onClickAddAdminButton(): void {
    this.showAddAdminModal = true;
  }

  onAddAdmin(): void{
    if(this.addAdminForm.valid){
      const payload = this.addAdminForm.value;
      this.adminService.createAdmin(payload).subscribe({
        next: result =>{
          alert('Admin added successfully!')
          this.showAddAdminModal = false;
        },
        error: error => {
          if(error.isCustomError){
            alert(error.message)
          }
          else{
            alert('Error adding admin!')
          }
          console.error('Error adding admin:', error)
        }
      })
    }
  }

  closeAddAdminModal(): void{
    this.showAddAdminModal = false;
    this.showElectoralOfficer = false;
  }

  displayElectoralOfficer(): void{
    this.showElectoralOfficer = true;
    this.showAddAdminModal = true;
  }

}
