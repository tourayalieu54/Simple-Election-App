import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit{
  users: any[] = [];
  filteredUsers: any[] = [];
  searchUsername: string = '';
  usernameSearchForm!: FormGroup;
  userForm!: FormGroup;
  showUserFormModal: boolean = false;
  wannaUpdateUser: boolean = false;
  updatingUser: any;
  showUpdateUserConfirmation: boolean = false;
  wannaDeleteUser: boolean = false;
  deletingUser: any;
  showDeleteUserConfirmation: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder){
    this.usernameSearchForm = this.fb.group({
      username : ['']
    })
    this.userForm = this.fb.group({
      username: [''],
      password: ['']
    })
  }

  ngOnInit(): void{
    this.fetchAllUsers();
  }

  fetchAllUsers(): void{
    this.userService.findAllUsers().subscribe({
      next: users => {
        this.users = users.filter((user:{role: string}) => user.role!=='Admin');
        this.filteredUsers = this.users;
      },
      error: error => {
        console.error('Error fetching users:', error)
      }
    })
  }

  fetchUsers(): void{
    const username = this.usernameSearchForm.get('username')?.value || ''
    this.filteredUsers = this.users.filter(user => user.username.includes(username))
  }

  closeUserFormModal(): void{
    this.showUserFormModal = false;
    this.wannaUpdateUser = false;
    this.wannaDeleteUser = false;
    this.showDeleteUserConfirmation = false;
    this.showUpdateUserConfirmation = false;
  }

  initiateUserUpdate(user: any): void{
    this.updatingUser = user;
    this.wannaUpdateUser = true;
    this.showUpdateUserConfirmation = false;
    this.showUserFormModal = true;
    this.userForm = this.fb.group({
      username: user.username,
      password: user.password
    })
  }

  confirmUpdate(): void{
    this.updatingUser.username = this.userForm.value.username
    this.updatingUser.password = this.userForm.value.password
    this.showUpdateUserConfirmation = true;
  }

  updateUser(): void{
    const payload = this.userForm.value;
    this.userService.updateUser(this.updatingUser._id, payload).subscribe({
      next: response => {
        alert('Updated successfully!')
        this.fetchAllUsers();
        this.closeUserFormModal();
      },
      error: error => {
        console.error('Error updating user:', error)
        if(error.error.isCustomError){
          alert(error.error.message)
        }
        else{
          alert('There was a problem submitting your update request, you might want to try again!');
        }
        this.closeUserFormModal()
      }
    })
  }

  initiateUserDelete(user: any): void{
    this.deletingUser = user;
    this.wannaDeleteUser = true;
    this.showDeleteUserConfirmation = true;
    this.showUserFormModal = true;
  }

  deleteUser(): void{
    this.userService.deleteUser(this.deletingUser._id).subscribe({
      next: response => {
        alert('User deleted successfully!')
        this.fetchAllUsers();
        this.closeUserFormModal();
      },
      error: error => {
        console.error('Error deleting user:', error)
        if(error.error.isCustomError){
          alert(error.error.message)
        }
        else{
          alert('User delete failed, please try again!')
        }
        this.closeUserFormModal()
      }
    })
  }

}
