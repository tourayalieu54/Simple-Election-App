import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  wrongCredentials:boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      const payload = {
        username: formData.username,
        password: formData.password
      }
      console.log('Login data:', formData);
      this.authService.login(payload).subscribe({
        next: response => {
          this.authService.saveToken(response.token) 
          console.log("Login success, token: ", this.authService.getToken())
          if(response.role==='Officer') this.route.navigateByUrl('/officer-dashboard')
          else if(response.role==='Candidate') this.route.navigateByUrl('/candidate-dashboard')
          else if(response.role==='Voter') this.route.navigateByUrl('/student-dashboard')
          else if(response.role==='Admin') this.route.navigateByUrl('/admin-dashboard')
          else{ alert('Invalid role')
            this.route.navigateByUrl('/login')
          }
          alert('Login success!')
        },
        error: error =>{
          console.error('Error logging in: ', error)
          
          this.wrongCredentials = true;
          this.loginForm.reset()
          console.error('Wrong credentials! Token not received :(')
        }
      })
    } else {
      console.log('Form is invalid');
      alert('Invalid form, please provide correct data!')
    }
  }
}
