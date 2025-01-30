import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  myForm: FormGroup;
  candidates: any[] = []; // Store candidates fetched for the selected position
  users: any[] = [];
  constructor(private fb: FormBuilder, private candidateService: CandidateService, private router: Router, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.myForm = this.fb.group({
      username: [''],
      password: [''],
      reEnterPassword: [''],
      role: [''],
      position: [''],
      candidate: [''],
      matNumber: [''],
      staffId: ['']
    });
  }

  ngOnInit(): void {}

  onRoleChange(): void {
    const role = this.myForm.get('role')?.value;

    if (role === 'Candidate') {
      this.myForm.get('position')?.enable();
    } else {
      this.myForm.get('position')?.disable();
      this.myForm.get('position')?.reset();
      this.myForm.get('candidate')?.reset();
      this.candidates = [];
    }
    this.cdr.detectChanges();
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const reEnterPassword = control.get('reEnterPassword')?.value;

    if (password && reEnterPassword && password !== reEnterPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  fetchCandidatesByPosition(): void {
    const position = this.myForm.get('position')?.value;
    if (position) {
      this.candidateService.getCandidatesByPosition(position).subscribe({
        next: (data) => {
          this.candidates = data;
        },
        error: (err) => {
          console.error('Error fetching candidates by position:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.myForm.valid) {
        const formValue = this.myForm.value;
        const payload = {
            username: formValue.username,
            password: formValue.password,
            role: formValue.role,
            matNumber: formValue.matNumber || null,
            position: formValue.position || null,
            candidateId: formValue.candidate || null,
            staffId: formValue.staffId || null
        };

        console.log('Payload to be sent to the backend:', payload);

        // Sending the payload to the backend
        this.authService.signup(payload).subscribe({
            next: response => {
                alert('Registered successfully!');
                this.router.navigateByUrl('/login');
            },
            error: error => {
              console.error('Error signing up:', error)
              if(error.error.isCustomError){
                alert(error.error.message)
              }
              else{
                alert('There was error submitting you signup request, please try again!')
              }
            }
        });
    } else {
        console.error('Form is invalid');
    }
}

}
